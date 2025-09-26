// import React from "react";
import styles from "../styles/NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page Not Found</p>
      <a href="/" className={styles.link}>
        Go Back Home
      </a>
    </div>
  );
}
