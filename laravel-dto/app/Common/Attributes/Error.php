<?php

namespace App\Common\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS_CONSTANT)]
class Error {

    const ATTRIBUTE_PATH = '\Attributes\Error';

    /** @var string error code */
    private $code;

    /** @var string error message */
    private $message;

    public function __construct(int $errorCode, string $message) {
        $this->code = $errorCode;
        $this->message = $message;
    }

    public function code() {
        return $this->code;
    }

    public function message() {
        return $this->message;
    }
}
