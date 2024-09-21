<?php

namespace App\Common\Attributes;

trait BaseEnumTrait
{
    /** get enums values for each cases as array */
    public static function toValueArray(): array
    {
        $array = [];
        foreach (static::cases() as $case) {
            array_push($array, $case->value);
        }
        return $array;
    }
}