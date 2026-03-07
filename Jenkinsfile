pipeline {
    agent any

    stages {

        stage('Check Branch') {
            steps {
                echo "Running pipeline for branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Login Salesforce') {
            when {
                branch 'main'
            }

            steps {
                withCredentials([
                    file(credentialsId: 'salesforce-jwt-key', variable: 'JWT_KEY'),
                    string(credentialsId: 'salesforce-consumer-key', variable: 'CLIENT_ID'),
                    string(credentialsId: 'salesforce-username', variable: 'SF_USERNAME')
                ]) {

                    bat """
                    sf org login jwt --client-id %CLIENT_ID% --jwt-key-file %JWT_KEY% --username %SF_USERNAME% --alias devhub
                    """

                }
            }
        }

        stage('Create Scratch Org') {
            when {
                branch 'main'
            }

            steps {
                bat "sf org create scratch --definition-file project-scratch-def.json --alias testscratch --duration-days 7"
            }
        }

        stage('Deploy Metadata') {
            when {
                branch 'main'
            }

            steps {
                bat "sf project deploy start"
            }
        }

    }
}
