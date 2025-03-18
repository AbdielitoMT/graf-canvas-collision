const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ADD8E6";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posx = x;
        this.posy = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posx, this.posy);

        context.lineWidth = 2;
        context.arc(this.posx, this.posy, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        // Actualizar la posición X
        this.posx += this.dx;
        // Cambiar la dirección si el círculo llega al borde del canvas en X
        if (this.posx + this.radius > window_width || this.posx - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Actualizar la posición Y
        this.posy += this.dy;
        // Cambiar la dirección si el círculo llega al borde del canvas en Y
        if (this.posy + this.radius > window_height || this.posy - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = "#"+(Math.floor(Math.random()*16777215).toString(16)); // Color aleatorio
        let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
        let text = "c"+(i + 1); // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    controlcolision(); // Verificar colisiones antes de mover los círculos
    circles.forEach(circle => {
        circle.update(ctx);
    });
    requestAnimationFrame(animate);
}

function controlcolision(){

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let c1 = circles[i];
            let c2 = circles[j];

            let dx = c1.posx - c2.posx;
            let dy = c1.posy - c2.posy;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < c1.radius + c2.radius) {

                // Cambiar el color de la circunferencia al colisionar
                c1.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                c2.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                
                // Intercambiar direcciones al colisionar
                let tempDx = c1.dx;
                let tempDy = c1.dy;

                c1.dx = c2.dx;
                c1.dy = c2.dy;
                c2.dx = tempDx;
                c2.dy = tempDy;

                // Evitar que los círculos se solapen ajustando posiciones
                let overlap = (c1.radius + c2.radius) - distance;
                let adjustX = (dx / distance) * (overlap / 2);
                let adjustY = (dy / distance) * (overlap / 2);

                c1.posx += adjustX;
                c1.posy += adjustY;
                c2.posx -= adjustX;
                c2.posy -= adjustY;
            }
        }

    }
}

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();