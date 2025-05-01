<template>
  <div class="welcome-container">
    <div class="animated-background">
      <div v-for="n in 10" :key="n" class="particle" :style="getRandomStyle()"></div>
    </div>
    <h1 class="welcome-text">Добро пожаловать</h1>
  </div>
</template>

<script setup>

// Function to generate random styles for particles
const getRandomStyle = () => {
  const size = Math.floor(Math.random() * 100) + 50;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const animDuration = (Math.random() * 15) + 10;
  const animDelay = Math.random() * 5;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${posX}%`,
    top: `${posY}%`,
    animationDuration: `${animDuration}s`,
    animationDelay: `${animDelay}s`
  };
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: white;
  position: relative;
  overflow: hidden;
  border-top: 2px solid #792ec9;
}

.welcome-text {
  font-size: 5rem;
  font-weight: 700;
  color: #792ec9;
  text-align: center;
  position: relative;
  z-index: 10;
  animation: pulse 3s infinite ease-in-out;
  font-family: 'Arial', sans-serif;
  letter-spacing: 2px;
  padding: 20px 40px;
  border: 1px solid #792ec9;
  border-radius: 6px;
  background-color: transparent;
  transition: all 0.2s ease;
}

.welcome-text:hover {
  background-color: rgba(121, 46, 201, 0.1);
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  border-radius: 6px;
  border: 1px solid #792ec9;
  background: transparent;
  animation: float infinite ease-in-out;
  opacity: 0.6;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(121, 46, 201, 0.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) rotate(0);
    opacity: 0.6;
    background-color: transparent;
  }
  50% {
    transform: translateY(-20px) translateX(20px) rotate(180deg);
    opacity: 0.3;
    background-color: rgba(121, 46, 201, 0.1);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(360deg);
    opacity: 0.6;
    background-color: transparent;
  }
}
</style>