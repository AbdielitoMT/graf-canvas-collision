const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ADD8E6";

class Circle {
    constructor(x, y, radius, color, speed) { // Elimina 'text'
        this.posx = x;
        this.posy = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;

        this.dx = 0;
        this.dy = this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.arc(this.posx, this.posy, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        this.posy += this.dy;

        // Si el círculo toca el borde inferior, lo reiniciamos arriba
        if (this.posy - this.radius > window_height) {
            this.posy = -this.radius;
        }
    }

     // Método para verificar si el clic está dentro del círculo
    isClicked(mouseX, mouseY) {
    let dx = this.posx - mouseX;
    let dy = this.posy - mouseY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius; // Devuelve true si el clic está dentro del círculo
}



}



// Crear un array para almacenar N círculos
let circles = [];
const numCircles = 20;

// Función para generar un círculo aleatorio
function createRandomCircle() {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius; // Posición X aleatoria
    let y = -radius; // SIEMPRE INICIAMOS EN LA PARTE SUPERIOR
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"); // Color aleatorio
    let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3

    return new Circle(x, y, radius, color, speed);
}

// Función para generar círculos iniciales
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        circles.push(createRandomCircle());
    }
}



// Función para animar los círculos
function animate() {
    /*ctx.clearRect(0, 0, window_width, window_height);
    controlcolision(); // Verificar colisiones antes de mover los círculos
    circles.forEach(circle => {
        circle.update(ctx);
    });
    requestAnimationFrame(animate);*/

    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(ctx);
    });
    requestAnimationFrame(animate);
}

// Evento de clic en el canvas para eliminar un círculo y generar uno nuevo
canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    let removed = false; // Bandera para verificar si eliminamos un círculo

    // Filtramos los círculos y eliminamos el clicado
    circles = circles.filter(circle => {
        if (!removed && circle.isClicked(mouseX, mouseY)) {
            removed = true; // Marcamos que eliminamos un círculo
            return false;   // No incluimos este círculo en el nuevo array
        }
        return true;
    });

    // Si se eliminó un círculo, generamos uno nuevo para reemplazarlo
    if (removed) {
        circles.push(createRandomCircle());
    }
});

/*function controlcolision(){

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
}*/

// Generar N círculos y comenzar la animación
generateCircles(numCircles); // Puedes cambiar el número de círculos aquí
animate();