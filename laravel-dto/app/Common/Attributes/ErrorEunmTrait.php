<?php

namespace App\Common\Attributes;

use ReflectionEnum;
use ReflectionAttribute;
use BadMethodCallException;

trait ErrorEunmTrait
{
    /**
     * Call the given method on the enum case
     *
     */
    public function __call(string $method, array $arguments): mixed
    {
        // Get attributes of the enum case with reflection API
        $reflection = new ReflectionEnum(static::class);
        $attributes = $reflection->getCase($this->name)->getAttributes();
        
        // Check if attribute exists in our attributes list
        $filtered_attributes = array_filter($attributes, fn (ReflectionAttribute $attribute) => $attribute->getName() === Error::class);

        // If there are multiple error attributes, throw an exception
        if (count($filtered_attributes) > 1) {
            throw new BadMethodCallException(sprintf('[%s] Cannot have multiple [%s] attribute', static::class, Error::class));
        }
        
        // If not, throw an exception
        if (empty($filtered_attributes)) {
            throw new BadMethodCallException(sprintf('Call to undefined method [%s::%s()]', static::class, $method));
        }

        return array_shift($filtered_attributes)->newInstance()->$method($arguments);
    }
}