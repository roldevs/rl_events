<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataGameCapacity extends RLEvents_GameDataQueryCache {

  public function data($postId) {
    $result = $this->firstById($postId, 'meta_value');
    return isset($result) ? $result->capacity : null;
  }

  // Protected

  protected function getStatement ($postIds) {
    return "SELECT
      pm_event.meta_value,
      pm_capacity.meta_value as capacity
    FROM {$wpdb->prefix}postmeta pm_event, {$wpdb->prefix}postmeta pm_capacity
    WHERE pm_event.post_id = pm_capacity.post_id AND
      pm_event.meta_key='_tribe_rsvp_for_event' AND
      pm_capacity.meta_key = '_tribe_ticket_capacity' AND
      pm_event.meta_value IN (".join(',', $postIds).")
    ;";
  }
}
