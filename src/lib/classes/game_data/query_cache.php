<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataQueryCache {
  protected $query;

  public function __construct($db, $postIds) {
    $this->query = new RLEvents_Query($db, $this->getStatement($postIds));
  }

  // Protected

  protected function getResults() {
    return $this->query->run();
  }

  protected function firstById($id, $field) {
    foreach ($this->getResults() as $item) {
      if ($item->$field == $id) { return $item; }
    }
    return null;
  }

  protected function findById($id, $field) {
    return array_filter($this->getResults(), function($item) use ($id, $field) {
      return $item->$field == $id;
    });
  }
}
