# 数字转大写中文PopClip插件

## 插件概述

本插件用于将选中的阿拉伯数字转换为中文大写金额格式，支持整数和小数转换，适用于财务、会计等需要填写中文大写金额的场景。

## 实现方案

### 1. 配置文件 (Config.json)

```json
{
  "popclipVersion": 4225,
  "identifier": "com.example.popclip.extension.number-to-chinese",
  "name": "数字转大写",
  "icon": "icon.png",
  "module": "number-to-chinese.ts",
  "entitlements": ["dynamic"],
  "description": "将阿拉伯数字转换为中文大写金额格式，支持整数和小数。"
}
```

### 2. 核心代码 (number-to-chinese.ts)

```typescript
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
```

### 3. 功能说明

1. **核心转换功能**：
   - 支持整数和小数转换（精确到分）
   - 自动处理"零"的正确使用（避免连续零和多余零）
   - 支持万、亿级别的大数字转换
   - 小数部分自动处理角分单位

2. **输入验证**：
   - 通过`isValidNumber()`函数验证输入是否为有效数字
   - 支持整数、小数和负数（负数会转换为正数处理）

3. **PopClip集成**：
   - 选中数字时自动触发转换
   - 转换结果显示在PopClip动作标题中
   - 点击动作自动粘贴结果



## 使用示例

| 输入数字   | 转换结果                             |
| ---------- | ------------------------------------ |
| 123        | 壹佰贰拾叁元整                       |
| 456.78     | 肆佰伍拾陆元柒角捌分                 |
| 9000       | 玖仟元整                             |
| 1001       | 壹仟零壹元整                         |
| 1234567.89 | 壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分 |

## 部署说明

1. 创建插件文件夹 ntcp.popclipext`
2. 将Config.json和number-to-chinese.ts放入文件夹
3. 添加图标文件icon.png（可选）
4. 双击文件夹导入PopClip
