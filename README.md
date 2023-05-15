# Description
Workers that seamlessly rebalance workload based on worker and task cardinalities with minimal collaboration and perturbations.

# Instructions
- Run `yarn deploy` in order to build a docker image and deploy the corresponding helm chart to the kubernetes cluster defined in your kube config file. 
- By default, a postgres database and table is created and seeded with 50 tasks. 5 workers are spawned to watch a balanced partition of the tasks. 
- Adjust the deployment replicas or add additional records to the Task table in order to see the workers autobalance.


