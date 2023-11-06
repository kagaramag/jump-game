<template>
  <div class="page-wrapper">
    <div class="game">
      <div class="environment-container" v-if="!gameOver">
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
      <div v-if="!gameOver" class="character" :style="characterStyle"></div>
      <div v-if="!gameOver" class="obstacle" :style="obstacleStyle"></div>
    </div>
    <div id="config-wrapper">
      <div class="config-row">
        <Button type="primary" v-if="gameOver" @click="restartGame"
          >Play</Button
        >
        <Button type="primary" v-else :disabled="true" @click="restartGame"
          >Play</Button
        >
      </div>

      <div class="config-row">Score: {{ score }}</div>
      <div class="config-row">
        <div>Game level({{ getGameConfig.GAME_LEVEL }})</div>
        <div class="game-levels">
          <Button
            type="secondary"
            :disabled="getGameConfig.GAME_LEVEL === 1 || !gameOver"
            @click="updateGameLevel(1)"
            >1</Button
          >
          <Button
            type="secondary"
            :disabled="getGameConfig.GAME_LEVEL === 2 || !gameOver"
            @click="updateGameLevel(2)"
            >2</Button
          >
          <Button
            type="secondary"
            :disabled="getGameConfig.GAME_LEVEL === 3 || !gameOver"
            @click="updateGameLevel(3)"
            >3</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "./../store";
import Button from "./button";
export default {
  name: "GameWrapper",
  components: {
    Button,
  },
  data() {
    return {
      characterPosition: {
        x: 0,
        y: 0,
      },
      obstaclePosition: {
        x: window.innerWidth,
        y: 0,
      },
      score: 0,
      gameInterval: null,
      gameOver: false,
      isJumping: false,
      speed: 15,
      GAME_LEVEL: 0,
    };
  },
  mounted() {
    this.gameInterval = requestAnimationFrame(this.gameLoop);
    window.addEventListener("keypress", (e) => {
      if (parseInt(e.keyCode) === 32) {
        this.jump();
      }
    });
  },
  beforeDestroy() {
    cancelAnimationFrame(this.gameInterval);
    window.removeEventListener("keypress", this.jump);
  },
  methods: {
    // RESTART THE GAME
    restartGame() {
      this.characterPosition = {
        x: 0,
        y: 0,
      };
      this.obstaclePosition = {
        x: window.innerWidth,
        y: 0,
      };
      this.score = 0;
      // store.dispatch("updateScore", 0);
      this.gameOver = false;
      this.gameLoop();
    },
    gameLoop() {
      if (!this.gameOver) {
        this.updateObstaclePosition();
        this.checkCollision();
        this.gameInterval = requestAnimationFrame(this.gameLoop);
      }
    },
    updateObstaclePosition() {
      this.obstaclePosition.x -= this.getGameConfig.GAME_SPEED || this.speed;

      if (this.obstaclePosition.x < -50) {
        this.obstaclePosition.x = window.innerWidth;
      }
    },
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

      if (this.isCollision(characterRect, obstacleRect)) {
        this.gameOver = true;
        this.score++;
      } else {
        this.score++;
      }
    },
    isCollision(character, obs) {
      return (
        character.x < obs.x &&
        character.x + character.width + 20 > obs.x &&
        !this.isJumping
      );
    },
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
    updateGameLevel(level) {
      store.dispatch("updateGameLevel", level);
    },
    jump() {
      this.characterPosition.y = 70;
      this.isJumping = true;
      setTimeout(() => {
        this.isJumping = false;
        this.characterPosition.y = 0;
      }, this.jumpHangTime());
    },
    jumpHangTime() {
      switch (this.getGameConfig.GAME_SPEED) {
        case 1:
          return 3000;
        case 2:
          return 2000;
        case 3:
          return 1000;
        default:
          break;
      }
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
</style>
