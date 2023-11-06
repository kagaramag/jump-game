<template>
  <div class="page-container">
    <div class="page-wrapper">
      <div class="game">
        <div class="wrap-alert-message">
          <div class="alert" v-if="GAME_OVER">Game is over</div>
        </div>
        <div class="environment-container" v-if="!GAME_OVER">
          <div class="wrap-clouds">
            <div class="cloud cloud1">
              <img
                src="./../assets/images/cloud1.svg"
                alt="character"
                width="104"
              />
            </div>
            <div class="cloud cloud2">
              <img
                src="./../assets/images/cloud2.svg"
                alt="character"
                width="104"
              />
            </div>
            <div class="cloud cloud3">
              <img
                src="./../assets/images/cloud3.svg"
                alt="character"
                width="104"
              />
            </div>
            <div class="cloud cloud4">
              <img
                src="./../assets/images/cloud3.svg"
                alt="character"
                width="104"
              />
            </div>
          </div>
        </div>
        <div v-if="!GAME_OVER" class="character" :style="characterStyle"></div>
        <div v-if="!GAME_OVER" class="obstacle" :style="obstacleStyle"></div>
      </div>
      <div id="config-wrapper">
        <div class="config-row">
          <Button type="primary" v-if="GAME_OVER" @click="restartGame"
            >Play</Button
          >
          <Button type="primary" v-else :disabled="true" @click="restartGame"
            >Play</Button
          >
        </div>
        <div class="config-row">Score: {{ SCORE }}</div>
        <div class="config-row">
          <div>Game level: {{ getGameConfig.GAME_LEVEL }}</div>
        </div>
        <div class="config-row">
          <div>Change level</div>
          <div class="game-levels">
            <Button
              type="secondary"
              :disabled="getGameConfig.GAME_LEVEL === 1 || !GAME_OVER"
              @click="updateGameLevel(1)"
              >1</Button
            >
            <Button
              type="secondary"
              :disabled="getGameConfig.GAME_LEVEL === 2 || !GAME_OVER"
              @click="updateGameLevel(2)"
              >2</Button
            >
            <Button
              type="secondary"
              :disabled="getGameConfig.GAME_LEVEL === 3 || !GAME_OVER"
              @click="updateGameLevel(3)"
              >3</Button
            >
          </div>
        </div>
        <div class="config-row" v-if="GAME_OVER && GAME_RESTARTED">
          <div class="alert">You need to restart the game</div>
        </div>
      </div>
    </div>
    <div class="footer">To jump or start, press <b>space</b> button</div>
  </div>
</template>

<script>
// IMPORT STORE
import store from "./../store";
// IMPORT REUSABLE BUTTON COMPONENT
import Button from "./button";
export default {
  name: "GameWrapper",
  components: {
    Button,
  },
  data() {
    return {
      // INITIAL POSITION OF MAIN CHARACTER
      characterPosition: {
        x: 0,
        y: 0,
      },
      // INITIAL POSITION OF OBSTACLE
      obstaclePosition: {
        x: window.innerWidth,
        y: 0,
      },
      GAME_INTERVAL: null,
      GAME_OVER: false,
      IS_JUMPING: false,
      SPEED: 5,
      SCORE: 0,
      GAME_LEVEL: 0,
      GAME_RESTARTED: false,
      TIME_PLAYED: 0,
      START_TIME: 0,
      MINUTES_ELAPSED: 0,
      autoplay: false,
    };
  },
  mounted() {
    // WHEN PAGE IS REFRESHED, PLAY THE GAME
    this.GAME_INTERVAL = requestAnimationFrame(this.gameLoop);
    // CHECK IF PLAYER PRESSES SPACE
    window.addEventListener("keypress", (e) => {
      if (parseInt(e.charCode) === 32 && !this.GAME_OVER) {
        this.jump();
      } else {
        this.restartGame();
      }
    });
  },
  beforeDestroy() {
    cancelAnimationFrame(this.GAME_INTERVAL);
    window.removeEventListener("keypress", this.jump);
  },
  methods: {
    // RESTART THE GAME
    restartGame() {
      this.GAME_RESTARTED = false;
      this.characterPosition = {
        x: 0,
        y: 0,
      };
      this.obstaclePosition = {
        x: window.innerWidth,
        y: 0,
      };
      this.SPEED = 0;
      this.GAME_OVER = false;
      this.gameLoop();
      this.playSound();
    },
    // GAME LOOP: IF GAME IS ON, ITERATES THROUGH THE GAME
    gameLoop() {
      if (!this.GAME_OVER) {
        this.updateObstaclePosition();
        this.checkCollision();
        this.GAME_INTERVAL = requestAnimationFrame(this.gameLoop);
      }
    },
    // ANIMATE OBSTACLE: FROM RIGHT TO LEFT
    updateObstaclePosition() {
      this.obstaclePosition.x -= this.getGameConfig.GAME_SPEED || this.SPEED;
      // IF OBSTACLE REACHES LEFT SIDE, RESET IT
      if (this.obstaclePosition.x < -50) {
        this.obstaclePosition.x = window.innerWidth;
      }
    },
    // CHECK COLLISION
    checkCollision() {
      const characterRect = {
        x: this.characterPosition.x,
        y: this.characterPosition.y,
        width: 40,
        height: 80,
      };

      const obstacleRect = {
        x: this.obstaclePosition.x,
        y: this.obstaclePosition.y,
        width: 30,
        height: 60,
      };
      // IF CHARACTER TOUCHES OBSTACLE, END THE GAME
      if (this.isCollision(characterRect, obstacleRect)) {
        this.GAME_OVER = true;
        this.GAME_RESTARTED = true;
        this.SCORE++;
      } else {
        this.SCORE++;
      }
    },
    // CHECK IF CHARACTER TOUCHES OBSTACLE
    isCollision(character, obs) {
      return (
        character.x < obs.x &&
        character.x + character.width + 20 > obs.x &&
        !this.IS_JUMPING
      );
    },
    // CHECK IF KE ON KEYBOARD IS PRESSED
    isKeyDown(key) {
      return (
        document.activeElement === document.body &&
        document.activeElement.addEventListener &&
        document.activeElement.addEventListener(
          "keydown",
          (event) => {
            if (event.key === key) {
              return true;
            }
          },
          false
        )
      );
    },
    // IF SPACE BUTTON IS PRESSED, CHARACTER SHOULD JUMP TO AVOID COLLISION
    jump() {
      this.characterPosition.y = 70;
      this.IS_JUMPING = true;
      this.playSound();
      setTimeout(() => {
        this.IS_JUMPING = false;
        this.characterPosition.y = 0;
      }, this.jumpHangTime());
    },
    // UPDATE GAME LEVEL(STATE)
    updateGameLevel(level) {
      store.dispatch("updateGameLevel", level);
    },
    // SET TIME(in ms) THE CHARACTER HANGS IN THE AIR
    jumpHangTime() {
      switch (this.getGameConfig.GAME_LEVEL) {
        case 1:
          return 600;
        case 2:
          return 400;
        case 3:
          return 200;
        default:
          break;
      }
    },
    // PLAY SOUND
    playSound() {
      const audio = new Audio(require("./../assets/sounds/audio.ogg"));
      audio.volume = 0.5;
      audio.play();
    },
  },
  computed: {
    // ANIMATE OBSTABLE
    obstacleStyle() {
      return {
        left: `${this.obstaclePosition.x}px`,
        bottom: `${this.obstaclePosition.y}px`,
      };
    },
    // MAKE CHARACTER JUMP WHEN SPACEBAR IS PRESSED
    characterStyle() {
      return {
        bottom: `${this.characterPosition.y}px`,
      };
    },
    // GET LEVEL OF THE GAME FROM STORE
    getGameConfig() {
      return store.getters.getGameConfig;
    },
  },
};
</script>

<style lang="scss">
.page-container {
  width: 100%;
  position: relative;
  .page-wrapper {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    width: 100%;
    max-width: 1000px;
    gap: 12px;
    .game {
      display: flex;
      width: 100%;
      height: 100vh;
      background: #3f86ff;
      position: relative;
      width: 800px;
      height: 400px;
      overflow: hidden;
      border-radius: 12px;
      .character,
      .obstacle {
        background-size: cover;
        position: absolute;
        bottom: 0;
      }

      .character {
        width: 40px;
        height: 80px;
        left: 50px;
        background-image: url("./../assets/images/person.gif");
        background-position: center;
      }

      .obstacle {
        width: 30px;
        height: 60px;
        background-image: url("./../assets/images/obstacle1.svg");
      }
    }

    #config-wrapper {
      width: 500px;
      background: #ffffff;
      border-radius: 12px;
      padding: 12;
      text-align: left;
      .config-row {
        padding: 16px;
        border-bottom: 1px solid #cdcdcd;
      }
      .game-levels {
        padding: 16px 0 0 0;
        display: flex;
        flex-direction: row;
        gap: 12px;
      }
    }
  }

  .environment-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 240px;
    .wrap-clouds {
      animation: clouse-animation 5s infinite linear;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100px;
      @keyframes clouse-animation {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      .cloud {
        position: absolute;
        bottom: 0;
        left: 0;
        img {
          width: 50px;
        }
      }
      .cloud1 {
        top: 20px;
        left: 50px;
      }

      .cloud2 {
        top: 120px;
        left: 250px;
      }

      .cloud3 {
        top: 10px;
        left: 440px;
      }
      .cloud4 {
        top: 80px;
        left: -80px;
      }
    }
  }
  .wrap-alert-message {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .alert {
    padding: 6px 16px;
    border-radius: 16px;
    background: #3f86ff;
    border: 1px solid #ffffff;
    color: #ffffff;
    font-size: 12px;
  }
  .footer {
    font-size: 14px;
    color: #ffffff;
    padding: 16px 0;
  }
}
</style>
