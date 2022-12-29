<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataGameEventDate extends RLEvents_GameDataQueryCache {
  public function data($postId) {
    $result = $this->firstById($postId, 'ID');
    return isset($result) ? $result->end_date : null;
  }

  // Protected

  protected function endDateData($organizer) {
    return $organizer->end_date;
  }

  protected function getStatement ($postIds) {
    return "SELECT
        wp_events.ID as ID,
        pm.meta_value as end_date
      FROM {$wpdb->prefix}posts wp_events,
        {$wpdb->prefix}posts wp_organizers,
        {$wpdb->prefix}postmeta pm
      WHERE wp_events.ID = pm.post_id
        AND pm.meta_key = '_EventEndDate'
        AND wp_events.post_type = 'tribe_events'
        AND wp_events.ID IN (".join(',', $postIds).")
    ;";
  }
}
