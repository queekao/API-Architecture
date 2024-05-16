import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(fieldName: string) {
  console.log(fieldName);

  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: 'multipart/form-data',
      required: true,
      schema: { type: 'object', properties: { [fieldName]: { type: 'string', format: 'binary' } }, $ref: undefined },
    }),
  );
}
