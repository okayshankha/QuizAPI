import fetch from 'node-fetch';
import * as htmlParser from 'node-html-parser';

export class Examdeva {
    parse(url: string, category_id: Number): Promise<any[]> {
        return fetch(url)
            .then(res => res.text())
            .then(body => {
                let htmlParsed = htmlParser.parse(body, {
                    lowerCaseTagName: false,
                    comment: false,
                    blockTextElements: {
                        script: true,
                        noscript: true,
                        style: true,
                        pre: true
                    }
                });

                let selectQuestions = htmlParsed.querySelectorAll('article.question');
                let QuestionsJson = [];
                
                for (let selectQuestionsIndex = 0; selectQuestionsIndex < selectQuestions.length; selectQuestionsIndex++) {
                    let QuestionJson: any = {};

                    let Question = selectQuestions[selectQuestionsIndex];
                    let QuestionMain = Question.querySelector('.question-main');
                    if (QuestionMain) {

                        /**
                         * Parse Question 
                         */
                        let QuestionRawText = QuestionMain.childNodes[0].rawText;
                        QuestionJson.question = QuestionRawText;


                        /**
                         * Parse Options 
                         */
                        let QuestionOptions = Question.querySelector('.question-options');
                        let selectQuestionOptionsPTags = QuestionOptions.querySelectorAll('p')
                        let QOptions = [];
                        for (let i = 0; i < selectQuestionOptionsPTags.length; i++) {
                            let selectQuestionOptionsPTagsParsed = htmlParser.parse(selectQuestionOptionsPTags[i].innerHTML);
                            let selectLabelsParsed = selectQuestionOptionsPTagsParsed.querySelectorAll('label')
                            for (let j = 0; j < 1 && j < selectLabelsParsed.length; j++) {
                                QOptions.push(selectLabelsParsed[1].childNodes[0].rawText)
                            }
                        }
                        QuestionJson.options = QOptions


                        /**
                         * Parse Answer 
                         */
                        let selectQuestionAnswer = Question.querySelector('.answer_container');
                        let selectQuestionAnswerPageContent = selectQuestionAnswer.querySelector('.page-content')
                        let correctAnswerParsed = selectQuestionAnswerPageContent.querySelectorAll('div')
                        let correctAnswer = correctAnswerParsed[1].childNodes[1].childNodes[0].rawText.trim()
                        QuestionJson.correct_option = correctAnswer;


                        /**
                         * Parse Explaination
                         */
                        let correctAnswerExplaination = correctAnswerParsed[2].innerText.replace('Solution:', '').trim().replace(/&nbsp;/g, '')
                        if (correctAnswerExplaination === "No explanation is given for this question  Let's Discuss on Board") {
                            QuestionJson.explaination = null
                            correctAnswerExplaination = null
                        } else {
                            QuestionJson.explaination = correctAnswerExplaination;
                        }

                        QuestionJson.category_id = category_id;

                        /**
                         * Add All Questions
                         */
                        
                        QuestionsJson.push(QuestionJson)
                    }
                }
                return QuestionsJson;
            })
    }
}

