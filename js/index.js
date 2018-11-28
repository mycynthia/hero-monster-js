class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }
  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }
  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
  // 加入特效及傷害數字
  var _this = this;
  var i = 1;

  _this.id = setInterval(function() {

      if (i == 1) {
        // 取靠近角色的特效圖片
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        // 取靠近角色的傷害數字
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

        _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/' + i + '.png';
        i ++;

        // 取消特效和傷害數字.
        if (i > 8) {
          _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
          _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
          _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
          clearInterval(_this.id);
        }
    },50);

  }
  die() {
    this.alive = false;
  }
  // 隨著戰鬥更新生命值和bar
  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    // 用 super去呼叫 baseCharacter class 的 contructor 方法
    super(name, hp, ap);
    // 建立HTML與Js物件關係
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    // 遊戲開始更新生命值數字
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
    // 測試角色是否創建成功
    console.log("招喚英雄" + this.name + "!");
  }
  attack(character) {
    // Math.random：取得一個由 0 至 1（不包含 1）的隨機數字
    var damage = Math.random() * (this.ap/2) + (this.ap/2);
    // Math.floor：將帶入的數字去掉浮點數的部分，變成整數
    super.attack(character, Math.floor(damage));
  }
  // 把負責生命值得elements傳給BaseCharacter
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    // 用 super去呼叫 baseCharacter class 的 contructor 方法
    super(name, hp, ap);
    // 建立HTML與Js物件關係
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");
    // 測試角色是否創建成功
    console.log("招喚怪獸" + this.name + "!");
  }
  attack(character) {
    // Math.random：取得一個由 0 至 1（不包含 1）的隨機數字
    var damage = Math.random() * (this.ap/2) + (this.ap/2);
    // Math.floor：將帶入的數字去掉浮點數的部分，變成整數
    super.attack(character, Math.floor(damage));
  }
  // 把負責生命值得elements傳給BaseCharacter
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 40);
// 回合結束機制
var rounds = 10;

function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    // 遊戲結束空白區
    finish();
  }
}

// 角色動作時間軸
function heroAttack () {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    hero.element.classList.add("attacking");

    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    },500);
  },100);

  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          // 遊戲結束空白區
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      // 遊戲結束空白區
      finish();
    }
  },1100);
}

// 設定戰鬥開始和結束，驅動heroAttack function的按鈕
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() {
    heroAttack();
  }
}
addSkillEvent();

// 加入勝負判斷開啟重設按鈕
function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose")
  }
}





