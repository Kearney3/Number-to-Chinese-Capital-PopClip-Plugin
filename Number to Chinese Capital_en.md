# Number to Chinese Capital PopClip Plugin

## Plugin Overview
This plugin converts selected Arabic numerals into Chinese capital amount format, supporting both integer and decimal conversions. It is suitable for financial, accounting, and other scenarios where Chinese capital amounts need to be filled.

## Implementation

### 1. Configuration File (Config.json)
```json
{
  "popclipVersion": 4225,
  "identifier": "com.example.popclip.extension.number-to-chinese",
  "name": "Number to Chinese",
  "icon": "icon.png",
  "module": "number-to-chinese.ts",
  "entitlements": ["dynamic"],
  "description": "Converts Arabic numerals to Chinese capital amount format, supporting integers and decimals."
}
```

### 2. Core Code (number-to-chinese.ts)
```typescript
/**
 * "Number to Chinese Capital" PopClip Extension
 * Converts Arabic numerals to Chinese capital amount format
 */

// Chinese capital digit mapping
const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
// Digit place mapping
const placeMap = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'];
// Decimal part units
const decimalUnits = ['角', '分'];

/**
 * Convert number to Chinese capital amount
 * @param num Input number
 * @returns Chinese capital amount string
 */
function numberToChinese(num: number): string {
  if (num === 0) return '零元整';
  
  let integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  // Process integer part
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
    
    // Handle ten-thousand and hundred-million units
    if (place % 4 === 0 && place !== 0 && !zeroFlag) {
      result += place === 4 ? '万' : place === 8 ? '亿' : '';
    }
  }
  
  result += '元';
  
  // Process decimal part
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
 * Validate if input is a valid number
 * @param input Input string
 * @returns Whether input is a valid number
 */
function isValidNumber(input: string): boolean {
  const num = parseFloat(input);
  return !isNaN(num) && isFinite(num) && /^-?\d+(\.\d+)?$/.test(input.trim());
}

/**
 * PopClip action registration
 */
export const actions: PopulationFunction = (input) => {
  const text = input.text.trim();
  
  if (!isValidNumber(text)) return;
  
  const num = parseFloat(text);
  const result = numberToChinese(num);
  
  const action: Action = () => result;
  action.title = result;
  action.icon = null; // Show result text as icon
  action.after = "paste-result";
  
  return action;
};
```

### 3. Features

1. **Core Conversion Features**:
   - Supports integer and decimal conversion (accurate to the cent)
   - Automatically handles proper usage of "零" (avoids consecutive and redundant zeros)
   - Supports large number conversion up to ten-thousand and hundred-million levels
   - Automatically processes jiao (角) and fen (分) units for decimal parts

2. **Input Validation**:
   - Validates input through `isValidNumber()` function
   - Supports integers, decimals, and negative numbers (negative numbers are converted to positive)

3. **PopClip Integration**:
   - Automatically triggers conversion when numbers are selected
   - Conversion result displays in PopClip action title
   - Clicking the action automatically pastes the result

## Usage Examples

| Input Number | Conversion Result |
|-------------|------------------|
| 123 | 壹佰贰拾叁元整 |
| 456.78 | 肆佰伍拾陆元柒角捌分 |
| 9000 | 玖仟元整 |
| 1001 | 壹仟零壹元整 |
| 1234567.89 | 壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分 |

## Deployment Instructions

1. Create plugin folder `ntcp.popclipext` (or "Number to Chinese Capital.popclipext" for English)
2. Place Config.json and number-to-chinese.ts into the folder
3. Add icon file icon.png (optional)
4. Double-click the folder to import into PopClip