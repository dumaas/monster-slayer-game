# Monster Slayer Game
## Attack Methods

### Basic Attack

- When pressed, reduce monster health
- Monster attacks back after press
- Code

    ```jsx
    function getRandomValue(min, max) {
      return Math.floor(Math.random() * (max - min)) + mi;
    }

    const app = Vue.createApp({
      data() {
        return {
          playerHealth: 100,
          monsterHealth: 100,
        };
      },
      models: {
        attackMonster() {
          // Calculate damage (random number between 5-12)
          const damage = getRandomValue(5, 12);
          // Reduce monster health by damage dealt
          this.monsterHealth -= damage;
          // trigger attackPlayer() on every call for attackMonster()
          this.attackPlayer();
        },
        attackPlayer() {
          // Calculate damage (random number between 8-15)
          const damage = getRandomValue(8, 15);
          // Reduce player health by damage dealt
          this.playerHealth -= damage;
        },
      },
    });

    app.mount('#game');
    ```

### Updating the Health Bars

- First connect basic attack methods with attack button

    ```html
    <button @click="attackMonster">ATTACK</button>
    ```

- Update health bar from attack damages

    ```html
    <div class="healthbar__value" :style="monsterBarStyles"></div>
    ...
    <div class="healthbar__value" :style="playerBarStyles"></div>
    ```

    ```jsx
    const app = Vue.createApp({
      data() {
        return {
          playerHealth: 100,
          monsterHealth: 100,
        };
      },
      // new
      computed: {
        monsterBarStyles() {
          return {width: this.monsterHealth + '%'}
        },
        playerBarStyles() {
          return {width: this.playerHealth + '%'}
        },
      },
    ...
    ```

### Special Attack

- Same as attackMonster(), but more damage
- Only available every 3 rounds
- Code

    ```jsx
    function getRandomValue(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    const app = Vue.createApp({
      data() {
        return {
          playerHealth: 100,
          monsterHealth: 100,
          currentRound: 0, // new
        };
      },
      computed: {
        monsterBarStyles() {
          return {width: this.monsterHealth + '%'}
        },
        playerBarStyles() {
          return {width: this.playerHealth + '%'}
        },
        mayUseSpecialAttack() { // new
          return this.currentRound % 3 !== 0;
        },
      },
      methods: {
        attackMonster() {
          // Increment round number
          this.currentRound++;
          // Calculate damage (random number between 5-12)
          const damage = getRandomValue(5, 12);
          // Reduce monster health by damage dealt
          this.monsterHealth -= damage;
          // trigger attackPlayer() on every call for attackMonster()
          this.attackPlayer();
        },
        attackPlayer() {
          // Calculate damage (random number between 8-15)
          const damage = getRandomValue(8, 15);
          // Reduce player health by damage dealt
          this.playerHealth -= damage;
        },
        specialAttackMonster() { // new
          // Increment current round
          this.currentRound++;
          // Damage range 10-25
          const damage = getRandomValue(10, 25);
          // Reduce monster health
          this.monsterHealth -= damage;
          // Monster attacks in response
          this.attackPlayer();
        },
      }
    });

    app.mount('#game');
    ```

    ```html
    <button :disabled="mayUseSpecialAttack" @click="specialAttackMonster">SPECIAL ATTACK</button>
    ```

## Other Methods

### Heal

- Code

    ```jsx
    ...
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
          // Monster attacks in response
          this.attackPlayer();
        },
    ...
    ```

    ```html
    <button @click="healPlayer">HEAL</button>
    ```

### Game Over

- Code

    ```jsx
    const app = Vue.createApp({
      data() {
        return {
          playerHealth: 100,
          monsterHealth: 100,
          currentRound: 0,
          winner: null, // new
        };
      },
    ...
      watch: { // new
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
    ...
    ```

    ```html
    <!-- Game Over -->
    <section class="container" v-if="winner">
      <h2>Game Over!</h2>
      <h3 v-if="winner === 'monster'">You lost!</h3>
      <h3 v-else-if="winner === 'player'">You won!</h3>
      <h3 v-else>It's a draw!</h3>
    </section>
    ```

### Finishing Core Functionality

- Fix health bars to go completely empty or completely full
- Add start new game button
- Surrender button
- Code

    ```jsx
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
        startGame() { // new
          // Reset default value
          this.playerHealth = 100;
          this.monsterHealth = 100;
          this.winner = null;
          this.currentRound = 0;
        },
        attackMonster() {
          // Increment round number
          this.currentRound++;
          // Calculate damage (random number between 5-12)
          const damage = getRandomValue(5, 12);
          // Reduce monster health by damage dealt
          this.monsterHealth -= damage;
          // trigger attackPlayer() on every call for attackMonster()
          this.attackPlayer();
        },
        attackPlayer() {
          // Calculate damage (random number between 8-15)
          const damage = getRandomValue(8, 15);
          // Reduce player health by damage dealt
          this.playerHealth -= damage;
        },
        specialAttackMonster() {
          // Increment current round
          this.currentRound++;
          // Damage range 10-25
          const damage = getRandomValue(10, 25);
          // Reduce monster health
          this.monsterHealth -= damage;
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
          // Monster attacks in response
          this.attackPlayer();
        },
        surrender() { // new
          this.winner = 'monster';
        },
      }
    });

    app.mount('#game');
    ```

    ```html
    <!-- Game Over -->
    <section class="container" v-if="winner">
      <h2>Game Over!</h2>
      <h3 v-if="winner === 'monster'">You lost!</h3>
      <h3 v-else-if="winner === 'player'">You won!</h3>
      <h3 v-else>It's a draw!</h3>
      <button @click="startGame">Start New Game</button>
    </section>

    <!-- controls only display if no winner -->
    <section id="controls" v-else>
      <button @click="attackMonster">ATTACK</button>
      <button :disabled="mayUseSpecialAttack" @click="specialAttackMonster">SPECIAL ATTACK</button>
      <button @click="healPlayer">HEAL</button>
      <button @click="surrender">SURRENDER</button>
    </section>
    ```

### Battle Log

- Things to display:
    - Which action occured?
    - Who started the action?
    - What was the value of the damage/healing?
- Code

    ```jsx
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
    ...
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
    ```

    ```html
    <!-- battle log -->
    <section id="log" class="container">
      <h2>Battle Log</h2>
      <ul>
        <li v-for="logMessage in logMessages">
          <span
            :class="{'log--player': logMessage.actionBy === 'player', 'log--monster': logMessage.actionBy === 'monster'}">
            {{ logMessage.actionBy === 'player' ? 'Player' : 'Monster' }}
          </span>
          <span v-if="logMessage.actionType === 'heal'">
            heals for <span class="log--heal">{{ logMessage.actionValue }}</span>
          </span>
          <span v-else>
            attacks and deals <span class="log--damage">{{ logMessage.actionValue }}</span>
          </span>
        </li>
      </ul>
    </section>
    ```