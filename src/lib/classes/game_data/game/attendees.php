<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataGameAttendees extends RLEvents_GameDataQueryCache {
  public function data($postId, $canGo) {
    return $this->filterAttendeesCanGo($postId, $canGo);
  }

  // Protected

  protected function filterAttendeesCanGo($postId, $canGo) {
    return array_values(array_filter($this->findById($postId, 'ID'), function($item) use($canGo) {
      return $item->can_go === $canGo;
    }));
  }

  protected function getStatement($postIds) {
    return "SELECT
      pm_eventid.meta_value as ID,
      pm_status.meta_value as can_go,
      pm_email.meta_value as email,
      pm_name.meta_value as name,
      wp.post_date as date
    FROM wp_posts wp,
      wp_postmeta pm_name,
      wp_postmeta pm_email,
      wp_postmeta pm_eventid,
      wp_postmeta pm_status
    WHERE wp.ID = pm_email.post_id AND
      wp.ID = pm_name.post_id AND
      wp.ID = pm_eventid.post_id AND
      wp.ID = pm_status.post_id AND
      wp.post_type = 'tribe_rsvp_attendees' AND
      pm_email.meta_key = '_tribe_rsvp_email' AND
      pm_name.meta_key = '_tribe_rsvp_full_name' AND
      pm_eventid.meta_key = '_tribe_rsvp_event' AND
      pm_status.meta_key = '_tribe_rsvp_status' AND
      pm_eventid.meta_value IN (".join(',', $postIds).")
    ";
  }
}
