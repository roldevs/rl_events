<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_Memoizer {
  protected $object = null;

  public function memoize($function) {
    if(!isset($this->object)) {
      $this->object = call_user_func($function);
    }

    return $this->object;
  }
}
