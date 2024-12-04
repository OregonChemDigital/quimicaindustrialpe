import { SocialIcon } from "react-social-icons";

const ContactPage = () => {
    return (
        <div className="container">
            <h2>Contáctanos</h2>
            <div className="contact-container">
                <div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9152160887134!2d-77.02256539999999!3d-12.117953399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8101aa54473%3A0x2b212b1faca265d6!2sJr.%20Dante%20236%2C%20Lima%2015047!5e0!3m2!1sen!2spe!4v1723852188797!5m2!1sen!2spe"
                        width="500"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen="yes"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                <div>
                    <h4>Dirección</h4>
                    <p>Jr. Dante 236, Lima 15047, Perú</p>
                    <h4>Horas</h4>
                    <p>Lunes - Viernes: 8am - 6pm</p>
                    <h4>Contacto</h4>
                    <p>Teléfono: +511 644 0141</p>
                    <p>Whatsapp: +511 961 555 000</p>
                    <p>Correo electrónico: contacto@quimicaindustrial.pe</p>
                </div>
                <div className="social-icons">
                    <SocialIcon network="whatsapp" />
                    <SocialIcon network="facebook" />
                    <SocialIcon network="instagram" />
                    <SocialIcon network="email" />

                </div>
            </div>
        </div>
    );
};

export default ContactPage;