<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataGameOrganizers extends RLEvents_GameDataQueryCache {
  public function data($postId) {
    return array_values(array_map(array($this, 'organizerData'), $this->findById($postId, 'ID')));
  }

  // Protected

  protected function organizerData($organizer) {
    return array(
      'id' => $organizer->organizer_id,
      'name' => $organizer->organizer
    );
  }

  protected function getStatement ($postIds) {
    return "SELECT
        wp_events.ID,
        pm.meta_value as organizer_id,
        wp_organizers.post_title as organizer
      FROM {$wpdb->prefix}posts wp_events,
        {$wpdb->prefix}posts wp_organizers,
        {$wpdb->prefix}postmeta pm
      WHERE wp_events.ID = pm.post_id
        AND pm.meta_key = '_EventOrganizerID'
        AND wp_events.post_type = 'tribe_events'
        AND wp_organizers.post_type = 'tribe_organizer'
        AND pm.meta_value = wp_organizers.ID
        AND wp_events.ID IN (".join(',', $postIds).")
    ;";
  }
}
