// Pausar el proceso
pause() {
    // Pausar el proceso
    this.isPaused = true;
    document.querySelector("#pause").textContent = "Reanudar";
  }
  
  // Reanudar el proceso
  resume() {
    // Reanudar el proceso
    this.isPaused = false;
    document.querySelector("#pause").textContent = "Pausar";
  }
  