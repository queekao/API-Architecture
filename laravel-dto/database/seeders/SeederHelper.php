<?php

namespace Database\Seeders;

use DB;

class SeederHelper
{
    public static function insertWithBasicFields(string $tableName, array $arrayData, int $index = 1) {
        $count = $index;
        foreach ($arrayData as $data) {
            $basicDatas = [
                'id' => $count,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            DB::table($tableName)->insert(collect($data)->merge($basicDatas)->toArray());
            $count += 1;
        }
    }

    public static function insertWithId(string $tableName, array $arrayData, int $index = 1) {
        $count = $index;
        foreach ($arrayData as $data) {
            $basicDatas = [
                'id' => $count,
            ];

            DB::table($tableName)->insert(collect($data)->merge($basicDatas)->toArray());
            $count += 1;
        }
    }
}