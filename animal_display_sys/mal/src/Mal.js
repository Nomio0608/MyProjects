
class Mal {
    constructor(name, sound, color, emoji) {
      this.name = name;
      this.sound = sound;
      this.color = color;
      this.emoji = emoji;
    }
  
    getSound() {
      return this.sound;
    }
  
    getColor() {
      return this.color;
    }
  
    getEmoji() {
      return this.emoji;
    }
}


class Horse extends Mal {
    constructor() {
      super("Horse", "Янцгаана", "Шарга", "🐎");
    }
}
  
class Camel extends Mal {
    constructor() {
      super("Camel", "Буйлна", "Бор", "🐪");
    }
}
  
class Cow extends Mal {
    constructor() {
      super("Cow", "Мөөрнө", "Улаан", "🐄");
    }
}
  
class Sheep extends Mal {
    constructor() {
      super("Sheep", "Майлна", "Цагаан", "🐑");
    }
}
  
class Coat extends Mal {
    constructor() {
      super("Coat", "Майлна", "Хөх", "🐐");
    }
}


export { Mal, Horse, Camel, Cow, Sheep, Coat };
