<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataGames {
  protected $db;
  protected $startDate;
  protected $endDate;
  protected $query;
  protected $capacityMemoizedObject;
  protected $attendeesMemoizedObject;
  protected $organizersMemoizedObject;
  protected $endDateMemoizedObject;

  public function __construct($db, $startDate, $endDate) {
    $this->db = $db;
    $this->startDate = $startDate;
    $this->endDate = $endDate;
    $this->query = new RLEvents_Query($db, $this->getStatement());
    $this->capacityMemoizedObject = new RLEvents_Memoizer();
    $this->attendeesMemoizedObject = new RLEvents_Memoizer();
    $this->organizersMemoizedObject = new RLEvents_Memoizer();
    $this->endDateMemoizedObject = new RLEvents_Memoizer();
  }

  public function games() {
    return array_map(array($this, 'gameData'), $this->getResults());
  }

  public function stats() {
    $masters = $this->statsMasters();
    $members = $this->statsMembers();
    $noMembers = $this->statsNonMembers();
    $systems = $this->statsSystems();

    return array(
      'games' => sizeof($this->getResults()),
      'booked' => $this->statsBooked(),
      'capacity' => $this->statsCapacity(),
      'mastersCount' => sizeof($masters),
      'membersCount' => sizeof($members),
      'bookedMembersCount' => $this->bookedCount($members),
      'bookedNoMembersCount' => $this->bookedCount($noMembers),
      'noMembersCount' => sizeof($noMembers),
      'uniqMembers' => $members,
      'uniqNonMembers' => $noMembers,
      'masters' => $masters,
      'cancelled' => $this->statsCancelled(),
      'systems' => $systems
    );
  }

  // Private

  private function getResultPostIds() {
    return array_map(array($this, 'postID'), $this->getResults());
  }

  function postID($record) {
    return $record->ID;
  }

  private function getResults() {
    return $this->query->run();
  }

  private function getCapacityObject() {
    return $this->capacityMemoizedObject->memoize(function() {
      return new RLEvents_GameDataGameCapacity($this->db, $this->getResultPostIds());
    });
  }

  private function gameOrganizerObject() {
    return $this->organizersMemoizedObject->memoize(function() {
      return new RLEvents_GameDataGameOrganizers($this->db, $this->getResultPostIds());
    });
  }

  private function gameEndDateObject() {
    return $this->endDateMemoizedObject->memoize(function() {
      return new RLEvents_GameDataGameEventDate($this->db, $this->getResultPostIds());
    });
  }

  private function gameAttendeesObject() {
    return $this->attendeesMemoizedObject->memoize(function() {
      return new RLEvents_GameDataGameAttendees($this->db, $this->getResultPostIds());
    });
  }

  private function gameCancelledObject() {
    return new RLEvents_GameDataGameCancelled();
  }

  private function getStatement () {
    global $wpdb;
    return "SELECT
        wp.ID,wp.post_title,pm.meta_value as start_date
      FROM
        {$wpdb->prefix}posts wp, {$wpdb->prefix}postmeta pm
      WHERE wp.ID = pm.post_id
        AND pm.meta_key='_EventStartDate'
        AND DATE(pm.meta_value) >= DATE('$this->startDate')
        AND DATE(pm.meta_value) <= DATE('$this->endDate')
        AND post_type = 'tribe_events'
        AND wp.post_status='publish'
      ORDER BY start_date ASC;";
  }

  private function gameData($record) {
    return array(
      'game' => $this->gameGameData($record),
      'attendees' => array(
        'can_go' => $this->attendeesCanGo($record),
        'cannot_go' => $this->gameAttendeesObject()->data($record->ID, 'no')
      )
    );
  }

  private function isGameCancelled($record) {
    return $this->gameCancelledObject()->isCancelled($this->attendeesCanGo($record));
  }

  private function attendeesCanGo($record) {
    return $this->gameAttendeesObject()->data($record->ID, 'yes');
  }

  private function gameGameData($record) {
    return array(
      'capacity' => $this->getCapacityObject()->data($record->ID),
      'date' => $record->start_date,
      'end_date' => $this->gameEndDateObject()->data($record->ID),
      "originalTitle" => $record->post_title,
      "title" => $this->gameGameTitle(htmlspecialchars($record->post_title)),
      "link" => get_permalink($record->ID),
      "gms" => $this->gameOrganizerObject()->data($record->ID),
      "cancelled" => $this->isGameCancelled($record),
      "system" => $this->gameGameSystem(htmlspecialchars($record->post_title))
    );
  }

  private function statsCapacity() {
    $totalCapacity = 0;
    foreach($this->getResults() as $record) {
      if(!$this->isGameCancelled($record)) {
        $capacity = $this->getCapacityObject()->data($record->ID);
        if($capacity >= 0) {
          $totalCapacity += $capacity;
        } else {
          $totalCapacity += sizeof($this->attendeesCanGo($record));
        }
      }
    }
    return $totalCapacity;
  }

  private function statsBooked() {
    $totalBooked = 0;
    foreach($this->getResults() as $record) {
      if(!$this->isGameCancelled($record)) {
        $totalBooked += sizeof($this->attendeesCanGo($record));
      }
    }
    return $totalBooked;
  }

  private function attendeesName($record) {
    return $record['name'];
  }

  private function allAttendeesData() {
    $players = [];
    foreach($this->getResults() as $record) {
      if(!$this->isGameCancelled($record)) {
        $players = array_merge($players, $this->attendeesCanGo($record));
      }
    }
    return $players;
  }

  private function allSystemData() {
    $systems = [];
    foreach($this->getResults() as $record) {
      array_push($systems, $this->gameGameSystem(htmlspecialchars($record->post_title)));
    }
    return $systems;
  }

  private function countSystem($acc, $system) {
    $acc[$system] = array_key_exists($system, $acc) ? $acc[$system] + 1 : 1;
    return $acc;
  }

  private function statsSystems() {
    return array_reduce($this->allSystemData(), array($this, 'countSystem'), array());
  }

  private function countMember($acc, $attendeeData) {
    if (!$attendeeData['member']) return $acc;

    $acc[$attendeeData['name']] = array_key_exists($attendeeData['name'], $acc) ? $acc[$attendeeData['name']] + 1 : 1;
    return $acc;
  }

  private function countNotMember($acc, $attendeeData) {
    if ($attendeeData['member']) return $acc;

    $acc[$attendeeData['name']] = array_key_exists($attendeeData['name'], $acc) ? $acc[$attendeeData['name']] + 1 : 1;
    return $acc;
  }

  private function countMaster($acc, $masterData) {
    $acc[$masterData['name']] = array_key_exists($masterData['name'], $acc) ? $acc[$masterData['name']] + 1 : 1;
    return $acc;
  }

  private function statsMembers() {
    return array_reduce($this->allAttendeesData(), array($this, 'countMember'), array());
  }

  private function statsNonMembers() {
    return array_reduce($this->allAttendeesData(), array($this, 'countNotMember'), array());
  }

  private function bookedCount($bookArray) {
    $total = 0;
    foreach($bookArray as $record => $count) {
      $total += $count;
    }
    return $total;
  }

  private function statsMasters() {
    $masters = [];
    foreach($this->getResults() as $record) {
      $masters = array_merge($masters, $this->gameOrganizerObject()->data($record->ID));
    }
    return array_reduce($masters, array($this, 'countMaster'), array());
  }

  private function statsCancelled() {
    $count = 0;
    foreach($this->getResults() as $record) {
      if($this->isGameCancelled($record)) {
        $count += 1;
      }
    }
    return $count;
  }

  private function gameGameTitle($postTitle) {
	  $DOUBLE_BRACKET_DIVIDER = ') (';
	  $SINGLE_BRACKET_DIVIDER = ' (';
	  $hasBracket = str_contains($postTitle, '(');

	  if (!$hasBracket) return $postTitle;

  	$hasDoubleBracket = str_contains($postTitle, $DOUBLE_BRACKET_DIVIDER);
	  $divider = $hasDoubleBracket ? $DOUBLE_BRACKET_DIVIDER : $SINGLE_BRACKET_DIVIDER;
    return explode($divider, $postTitle)[0].($hasDoubleBracket ? ')':'');
  }

  private function gameGameSystem($postTitle) {
	  $DOUBLE_BRACKET_DIVIDER = ') (';
	  $SINGLE_BRACKET_DIVIDER = ' (';
	  $hasBracket = str_contains($postTitle, '(');

	  if (!$hasBracket) return '';

  	$hasDoubleBracket = str_contains($postTitle, $DOUBLE_BRACKET_DIVIDER);
	  $divider = $hasDoubleBracket ? $DOUBLE_BRACKET_DIVIDER : $SINGLE_BRACKET_DIVIDER;
    $title = explode($divider, $postTitle)[1].($hasDoubleBracket ? ')':'');
	  return str_replace(')', '', str_replace('(', '', $title));
  }
}
