import styles from "./About.module.css";

export default function About() {
  return (
    <>
      <h2>What I do</h2>
      <p className={styles.text}>
        My name is Victor Lameda Rojas and I create custom websites tailored to
        your needs, whether you're an individual, a small business, or a large
        enterprise. I will work closely with you to bring your vision to life.
      </p>
      <h2>My Mission</h2>
      <p className={styles.text}>
        My mission is to provide high-quality, affordable web development
        services that help my clients succeed online. I believe that a great
        website is the foundation of any successful business, and I'm committed
        to delivering exceptional results that exceed your expectations.
      </p>
      <h2>Contact Information</h2>
      <p className={styles.text}>
        If you're interested in learning more about my services or would like to
        discuss your project, please don't hesitate to contact me. I'm always
        happy to answer any questions you may have and provide you with a free
        consultation.
      </p>
      <p className={styles.text}>
        Shoot me an email at
        <a href="mailto:vmlr123@gmail.com"> vmlr123@gmail.com </a>
        or go to the Survey page to fill out a form and I'll get back to you as
        soon as possible!
      </p>
    </>
  );
}
