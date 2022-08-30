<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_Query {
  protected $db;
  protected $sqlStatement;
  protected $endDate;
  protected $resultMemoization;

  public function __construct($db, $sqlStatement) {
    $this->db = $db;
    $this->sqlStatement = $sqlStatement;
    $this->resultMemoization = new RLEvents_Memoizer();
  }

  public function run() {
    return $this->resultMemoization->memoize(function() {
      return $this->db->getSqlResults($this->sqlStatement);
    });
  }
}
