import React, { useState } from 'react';
import styles from './FaqSection.module.css';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "How much does a typical painting project cost?",
        answer: "Costs vary based on the specific scope, size, surface condition, and paint quality of your project. We provide complimentary, detailed estimates with absolutely no hidden fees. To give you a general idea, most single interior rooms range from $400 to $2,000, while full exterior repaints typically start around $3,000 and can exceed $15,000. Contact us today for a personalized quote tailored exactly to your home."
    },
    {
        question: "What is included in my free estimate?",
        answer: "Our comprehensive estimate process includes an on-site assessment, a thorough evaluation of surface conditions, and color consultation if desired. You will receive a clear, written proposal detailing the scope of work, timeline, and a transparent pricing breakdown. We are here to answer all your questions with absolutely no pressure or obligation."
    },
    {
        question: "How long does a typical painting project take?",
        answer: "While every project is unique, most interior jobs are completed within 2-5 days. Exterior projects typically take 1-3 weeks, depending on weather and scope. We will provide a precise, detailed schedule during your estimate and keep you consistently updated on our progress throughout the entire project."
    },
    {
        question: "What type of paint do you use?",
        answer: "We exclusively use premium, high-quality products from trusted brands like Sherwin-Williams, Benjamin Moore, and Behr to guarantee a durable and flawless finish. During your consultation, we will discuss the best options to perfectly match your specific aesthetic preferences, durability needs, and budget."
    },
    {
        question: "What happens if unexpected issues arise during the project?",
        answer: "We pride ourselves on providing a transparent timeline and adhering to it. However, if we uncover hidden damage or unforeseen issues during surface preparation, we will communicate with you immediately. Transparency is our core principle—we will never proceed with additional work or alter the budget without your explicit approval."
    },
    {
        question: "How do I schedule an estimate or consultation?",
        answer: "Scheduling is easy and convenient. You can click any 'Get a Free Quote' button on our website or call us directly at 773-799-0006. We will schedule a brief 15- to 30-minute visit to take precise measurements, discuss your vision, answer any questions, and provide you with a detailed estimate. We typically respond to all inquiries within 24 business hours."
    }
];

export const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faqSection}>
            <div className={styles.faqContainer}>
                <h2 className={styles.sectionTitle}>
                    Frequently Asked <span className={styles.highlight}>Questions</span>
                </h2>
                <div className={styles.faqList}>
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index} className={styles.faqItem}>
                            <button
                                className={styles.faqButton}
                                onClick={() => toggleFaq(index)}
                                aria-expanded={isOpen}
                            >
                                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                                <span className={`${styles.iconWrapper} ${isOpen ? styles.iconExpanded : ''}`}>
                                    {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                                </span>
                            </button>
                            <div className={`${styles.faqAnswerWrapper} ${isOpen ? styles.expanded : ''}`}>
                                <div className={styles.faqAnswerContent}>
                                    <p className={styles.faqAnswer}>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
        </section>
    );
};
