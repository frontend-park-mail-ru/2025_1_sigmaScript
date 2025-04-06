function camelToSnake(key: string): string {
  let result = '';

  for (let i = 0; i < key.length; i++) {
    const symb = key[i];

    if ('A' <= symb && symb <= 'Z') {
      // у первого слова нет подчёркивания
      if (i !== 0) {
        result += '_';
      }
      result += symb.toLowerCase();
    } else {
      result += symb;
    }
  }

  return result;
}

function snakeToCamel(key: string): string {
  const parts = key.split('_');

  return parts
    .map((part, index) => {
      return index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

export function serialize(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(serialize);
  } else if (obj === null || typeof obj !== 'object') {
    // если не объект
    return obj;
  }

  const newObj: Record<string, unknown> = {};
  const entries = obj as Record<string, unknown>;

  for (const key in entries) {
    if (Object.prototype.hasOwnProperty.call(entries, key)) {
      newObj[camelToSnake(key)] = serialize(entries[key]);
    }
  }

  return newObj;
}

export function deserialize(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(serialize);
  } else if (obj === null || typeof obj !== 'object') {
    // если не объект
    return obj;
  }

  const newObj: Record<string, unknown> = {};
  const entries = obj as Record<string, unknown>;

  for (const key in entries) {
    if (Object.prototype.hasOwnProperty.call(entries, key)) {
      newObj[snakeToCamel(key)] = deserialize(entries[key]);
    }
  }

  return newObj;
}
