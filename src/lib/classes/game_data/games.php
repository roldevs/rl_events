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

  public function data() {
    return array_map(array($this, 'gameData'), $this->getResults());
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

  private function getStatement () {
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
        'can_go' => $this->gameAttendeesObject()->data($record->ID, 'yes'),
        'cannot_go' => $this->gameAttendeesObject()->data($record->ID, 'no')
      )
    );
  }

  private function gameGameData($record) {
    return array(
      'capacity' => $this->getCapacityObject()->data($record->ID),
      'date' => $record->start_date,
      'end_date' => $this->gameEndDateObject()->data($record->ID),
      "title" => htmlspecialchars($record->post_title),
      "link" => get_permalink($record->ID),
      "gms" => $this->gameOrganizerObject()->data($record->ID)
    );
  }
}
