// hero and monster method
class BaseCharacter {
  // 初始化物件角色
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }
  // 攻擊其他角色或計算傷害
  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }
  // 角色被攻擊減少的hp及死亡判斷
  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }

    // 攻擊時的傷害特效及數字
    var _this = this;
    var i = 1;
    _this.id = setInterval(function() {
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+i+'.png';
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);
  }
  // 宣告死亡角色
  die() {
    this.alive = false;
  }
  // 生命值及bar變動
  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100-this.hp/this.maxHp * 100)+"%";
  }
}

// hero
class Hero extends BaseCharacter {
  // 角色
  constructor(name, hp, ap) {
    super(name, hp, ap);
    // 建立js與html tag關係
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    // 在遊戲開始時更新生命值的數字
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("招喚英雄"+ this.name + "成功！");
  }
  // 攻擊
  attack(character, damage) {
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character, Math.floor(damage));
  }
  // 計算傷害
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
  // 恢復體力
  getHeal() {
    var healHp = 30;
    this.hp += healHp;
    if(this.hp > this.maxHp) {
      this.hp = this.maxHp;
      
    }
    this.updateHtml(this.hpElement ,this.hurtElement);
    // 補充體力特效文字及圖片
    var _this = this;
    var a = 1;
    _this.healid = setInterval(function() {
      if(a == 1) {
        _this.element.getElementsByClassName("heal-images")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = healHp; 
      }
      _this.element.getElementsByClassName("heal-images")[0].src = 'images/effect/heal/'+a+'.png';
      a++ ;

      if(a > 8) {
        _this.element.getElementsByClassName("heal-images")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.healid);        
      }
    },70);
  }
}

  // hero點擊恢復體力時
function addHealEvent() {
  var heal = document.getElementById("heal");
  heal.onclick = function() {
    heroHeal();
  }
}
addHealEvent();

// hero恢復體力
function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  hero.getHeal();
  // hero補血後怪獸攻擊
  setTimeout(function() {
    monster.element.classList.add("attacking");
    setTimeout(function() {
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      endTurn();
      if(hero.alive == false) {
        finish();
      } else {
        document.getElementsByClassName("skill-block")[0].style.display = "block";
      }      
    },500);
  },300);
}

// monster
class Monster extends BaseCharacter {
  // 角色
  constructor(name, hp, ap) {
    super(name, hp, ap);
    // 建立js與html tag關係
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    // 在遊戲開始時更新生命值的數字
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log(this.name+"怪獸出現了");
  }
  // 攻擊
  attack(character, damage) {
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character, Math.floor(damage));
  }
  // 計算傷害
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

// 設定遊戲回合
var rounds = 10;
function endTurn() {
  rounds -- ;
  document.getElementById("round-num").textContent = rounds;
  // 遊戲結束時...
  if(rounds < 1){
    finish();
  }
}

// 點擊攻擊時
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() {
    heroAttack();
  }
}
addSkillEvent();

// 設定hero攻擊
function heroAttack() {
  // hero攻擊時攻擊圖案隱藏
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  // hero向右移動攻擊monster
  setTimeout(function() {
    hero.element.classList.add("attacking");
    // hero攻擊玩後回原位
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    },500)
  },100);

  //如果monster活著才可以攻擊
  setTimeout(function() {
    if(monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        // 回合結束判斷hero是否還活著
        if(hero.alive == false) {
          // hero死了遊戲結束
          finish();
          } else {
            document.getElementsByClassName("skill-block")[0].style.display = "block";
          }
      },500);
    } else {
      // monster死了遊戲結束
      finish();
    }
  },1100);
}

// 設定判斷輸贏的function
function finish() {
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

// keyboard綁定攻擊及heal hp事件
document.onkeyup = function(event) {
  var key = String.fromCharCode(event.keyCode);
  if(key == "A") heroAttack();
  if(key == "D") heroHeal();
}

// 創建角色
var hero = new Hero("Cynthia", 130, 50);
var monster = new Monster("Dwell", 130, 50);



