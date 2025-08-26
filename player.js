class Dino {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.baseY = y; // Guardar la posición Y inicial (el suelo)
        this.width = width;
        this.height = height;
        this.color = color;

        this.velocityY = 0;
        this.isJumping = false;
        this.gravity = 0.8;
        this.jumpForce = -18;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // Si no está en el aire, no hagas nada de física
        if (!this.isJumping) {
            this.y = this.baseY;
            return;
        }

        // Aplicar gravedad
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Si toca el suelo
        if (this.y >= this.baseY) {
            this.y = this.baseY;
            this.isJumping = false;
            this.velocityY = 0;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }
}