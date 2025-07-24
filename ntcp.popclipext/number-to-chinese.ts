/**
 * "数字转大写" PopClip 扩展
 * 将阿拉伯数字转换为中文大写金额格式
 */

// 中文大写数字映射
const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
// 位数映射
const placeMap = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'];
// 小数部分单位
const decimalUnits = ['角', '分'];

/**
 * 将数字转换为中文大写金额
 * @param num 输入数字
 * @returns 中文大写金额字符串
 */
function numberToChinese(num: number): string {
  if (num === 0) return '零元整';
  
  let integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  // 处理整数部分
  let integerStr = integerPart.toString();
  let result = '';
  let zeroFlag = false;
  
  for (let i = 0; i < integerStr.length; i++) {
    const digit = parseInt(integerStr[i]);
    const place = integerStr.length - i - 1;
    
    if (digit === 0) {
      zeroFlag = true;
    } else {
      if (zeroFlag) {
        result += '零';
        zeroFlag = false;
      }
      result += digitMap[digit] + placeMap[place];
    }
    
    // 处理万和亿的单位
    if (place % 4 === 0 && place !== 0 && !zeroFlag) {
      result += place === 4 ? '万' : place === 8 ? '亿' : '';
    }
  }
  
  result += '元';
  
  // 处理小数部分
  if (decimalPart === 0) {
    result += '整';
  } else {
    const jiao = Math.floor(decimalPart / 10);
    const fen = decimalPart % 10;
    
    if (jiao > 0) {
      result += digitMap[jiao] + decimalUnits[0];
    } else if (integerPart > 0) {
      result += '零';
    }
    
    if (fen > 0) {
      result += digitMap[fen] + decimalUnits[1];
    }
  }
  
  return result;
}

/**
 * 验证输入是否为有效数字
 * @param input 输入字符串
 * @returns 是否为有效数字
 */
function isValidNumber(input: string): boolean {
  const num = parseFloat(input);
  return !isNaN(num) && isFinite(num) && /^-?\d+(\.\d+)?$/.test(input.trim());
}

/**
 * PopClip 动作注册
 */
export const actions: PopulationFunction = (input) => {
  const text = input.text.trim();
  
  if (!isValidNumber(text)) return;
  
  const num = parseFloat(text);
  const result = numberToChinese(num);
  
  const action: Action = () => result;
  action.title = result;
  action.icon = null; // 显示结果文本作为图标
  action.after = "paste-result";
  
  return action;
};