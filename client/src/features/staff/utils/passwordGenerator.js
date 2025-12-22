// utils/passwordGenerator.js
const passwordGenerator = {
  forbiddenSequences: [
    'qwerty', 'asdfgh', 'zxcvbn', '123456', 'йцукен',
    'password', 'admin', 'qazwsx', '123qwe', '1qaz2wsx'
  ],

  dictionaryWords: [
    'admin', 'password', 'qwerty', '123456', 'letmein',
    'monkey', 'dragon', 'master', 'hello', 'sunshine'
  ],

  generateMemorablePattern() {
    const patterns = [
      () => {
        const words = ['Star', 'Qwe', 'Sky', 'Sea', 'Asd'];
        const symbols = ['!', '#', '%', '*'];
        const word = words[Math.floor(Math.random() * words.length)];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const numbers = Math.floor(100 + Math.random() * 900);
        return `${word}${symbol}${numbers}`;
      },
      () => {
        const groups = ['Abc', 'Xyz', '123', '456', '789'];
        const symbols = ['!', '#', '%', '*'];
        const group1 = groups[Math.floor(Math.random() * groups.length)];
        const group2 = groups[Math.floor(Math.random() * groups.length)];
        return `${group1}${symbols[Math.floor(Math.random() * symbols.length)]}${group2}`;
      }
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },

  hasForbiddenSequence(pwd) {
    const lowerPwd = pwd.toLowerCase();
    
    for (const seq of this.forbiddenSequences) {
      if (lowerPwd.includes(seq)) return true;
    }
    
    for (const word of this.dictionaryWords) {
      if (lowerPwd.includes(word.toLowerCase())) return true;
    }
    
    for (let i = 0; i < pwd.length - 2; i++) {
      const char1 = pwd.charCodeAt(i);
      const char2 = pwd.charCodeAt(i + 1);
      if (Math.abs(char1 - char2) === 1) {
        const char3 = pwd.charCodeAt(i + 2);
        if (Math.abs(char2 - char3) === 1) return true;
      }
    }
    
    return false;
  },

  checkPasswordStrength(pwd) {
    let score = 0;
    const requirements = {
      length: pwd.length >= 15,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[!>#%*\/]/.test(pwd)
    };
    
    if (requirements.length) score += 2;
    if (requirements.uppercase) score += 1;
    if (requirements.lowercase) score += 1;
    if (requirements.numbers) score += 1;
    if (requirements.symbols) score += 2;
    if (pwd.length >= 20) score += 1;
    
    let level, color;
    if (score >= 6) {
      level = 'strong';
      color = '#52c41a';
    } else if (score >= 4) {
      level = 'medium';
      color = '#faad14';
    } else {
      level = 'weak';
      color = '#ff4d4f';
    }
    
    return { level, color, score, requirements };
  },

  generatePassword(length = 15) {
    let newPassword = '';
    for (let i = 0; i < 50; i++) {
      newPassword = '';
      while (newPassword.length < length) {
        newPassword += this.generateMemorablePattern();
      }
      newPassword = newPassword.substring(0, length);
      
      if (
        /[A-Z]/.test(newPassword) &&
        /[a-z]/.test(newPassword) &&
        /[0-9]/.test(newPassword) &&
        /[!>#%*\/]/.test(newPassword) &&
        !this.hasForbiddenSequence(newPassword)
      ) {
        return {
          password: newPassword,
          strength: this.checkPasswordStrength(newPassword)
        };
      }
    }
    return {
      password: '',
      strength: { level: 'error', color: '#ff4d4f', score: 0, requirements: {} }
    };
  }
};

export default passwordGenerator;