function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth <= 0) {
        return { width: '0%' };
      } else if (this.monsterHealth >= 100) {
        return { width: '100%' };
      }
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      if (this.playerHealth <= 0) {
        return { width: '0%' };
      } else if (this.playerHealth >= 100) {
        return { width: '100%' };
      }
      return { width: this.playerHealth + '%' };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // Draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // Player lost
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // Draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'player';
      }
    },
  },
  methods: {
    startGame() {
      // Reset default value
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },
    attackMonster() {
      // Increment round number
      this.currentRound++;
      // Calculate damage (random number between 5-12)
      const damage = getRandomValue(5, 12);
      // Reduce monster health by damage dealt
      this.monsterHealth -= damage;
      // Log player attack
      this.addLogMessage('player', 'attack', damage);
      // trigger attackPlayer() on every call for attackMonster()
      this.attackPlayer();
    },
    attackPlayer() {
      // Calculate damage (random number between 8-15)
      const damage = getRandomValue(8, 15);
      // Reduce player health by damage dealt
      this.playerHealth -= damage;
      // Log monster attack
      this.addLogMessage('monster', 'attack', damage);
    },
    specialAttackMonster() {
      // Increment current round
      this.currentRound++;
      // Damage range 10-25
      const damage = getRandomValue(10, 25);
      // Reduce monster health
      this.monsterHealth -= damage;
      // Log player attack
      this.addLogMessage('player', 'special-attack', damage);
      // Monster attacks in response
      this.attackPlayer();
    },
    healPlayer() {
      // Increment current round
      this.currentRound++;
      // Caclulate healValue
      const healValue = getRandomValue(8, 20);
      // Increase player health (up to 100)
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      // Log player heal
      this.addLogMessage('player', 'heal', healValue);
      // Monster attacks in response
      this.attackPlayer();
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      // Add new messages to the top of the array
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  }
});

app.mount('#game');
