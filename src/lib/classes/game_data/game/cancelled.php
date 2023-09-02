<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataGameCancelled {
  protected $cancelledNames = array(
    "'cancelado'",
    "'cancelada'",
    'cancelado',
    'cancelada',
    'Anulada',
    'yo',
  );

  public function isCancelled($attendeesCanGo) {
    foreach($attendeesCanGo as $attendee) {
      foreach($this->cancelledNames as $cancelledName) {
        if($this->cleanName($attendee['name']) === $this->cleanName($cancelledName)) {
          return true;
        }
      }
    };
    return false;
  }

  // Protected

  protected function cleanName($discordId) {
    return strtolower(trim($discordId));
  }
}

