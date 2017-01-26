
export class KRUtils {

  public static mergeObj(source1: Object, source2: Object) {
    Object.keys(source2).forEach((key) => {
      if (!!source1[key] && KRUtils.isPrimitive(source1[key])) {
        KRUtils.mergeObj(source1[key], source2[key]);
      } else {
        source1[key] = source2[key];
      }
    });
    return source1;
  }

  public static isPrimitive(obj) {
    switch (typeof obj) {
      case 'string':
      case 'number':
      case 'boolean':
        return true;
      default:
        break;
    }
    return !!(obj instanceof String || obj === String ||
      obj instanceof Number || obj === Number ||
      obj instanceof Boolean || obj === Boolean);
  }
}