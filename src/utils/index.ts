export function formatName(name: string) {
  let newStr;
  if (name.length === 2) {
    newStr = name.substring(0, 1) + "*";
  } else if (name.length > 2) {
    // let char = "";
    // for (let i = 0, len = name.length - 2; i < len; i++) {
    //   char += "*";
    // }
    newStr =
      name.substring(0, 1) + "*" + name.substring(name.length - 1, name.length);
  } else {
    newStr = name;
  }

  return newStr;
}

export function stepsArrayData(min: number, max: number, step: number) {
  let arr: { text: string; value: number }[] = [];
  for (let i = min; i <= max; i = i + step) {
    arr.push({
      text: `${i}小时`,
      value: i,
    });
  }
  return arr;
}

export function hiddenPartMobile(str: string) {
  if (typeof str === "string") {
    return str.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  }
  return str;
}
