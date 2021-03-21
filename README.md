# Approvals engine

## Business context
Generally enterprise applications require multiple people to review a certain process or an artifact and approve it before it can be published or made generally available.

Depending upon multiple rules, there could be multiple levels of approvals required.

## Overview

This is a sample angular based proof of concept to demostrate a simple Approvals engine functionality that demonstrates **Multi stage approvals**

### Samples
- [newclient.yaml](https://github.com/adhamankar/approvals-engine/blob/main/webapp/src/staticfiles/newclient.yaml) - 
simple multistage  workflow with no parameters and sequencial approval stages

- [newclientfintrans.yaml](https://github.com/adhamankar/approvals-engine/blob/main/webapp/src/staticfiles/newclientfintrans.yaml) - 
complex multistage workflow with conditional branches

![sample view](https://github.com/adhamankar/approvals-engine/blob/main/assets/sample.png)

Any given workflow template consists of following components:

- **parameters**  
    These are input parameters passed by the calling application that can be used for evaluating the a given stage for navigating to the next stages

-  **stages**  
    Every stage in a workflow further consists of following

    - **code**  
        Code to uniquely identify a stage in the workflow. *(Used when defining next_stages)*

    - **title**  
        Display name of the current stage
    - **approverGroups**  
        one or more group (group of people) that can be approve the current stage
    - **next**  
        list of next possible stages.  
        Depending upon the condition to evaluate the next stage is selected.

**NOTE**: *Every workflow template should have atleast 1 Stage marked as INITIAL and one or more stages marked as FINAL*

## Defining conditions for next-stage
Following set of condition operators are supported

- **CONSTANT**  
    Match a specific constant value
- **PARAMETER**  
    Use the workflow parameter *(explained above)* value for evaluating the condition. *Typically used in combination of CONSTANT*  

- **BINARY**  
    This is a connector between 2 or more conditions. Currently support 2 operators
    - **EQ** equality operator
    - **IN** evaluates if left field is in the right list

    *e.g.* client_code EQ MSFT                    

- **COMPLEX**  
    This type enables users to build as complex a condition as needed by using combination of above condition types by using one of the below connectors
    - **AND** - all conditions should be satisfied to proceed to next stage
    - **OR** - any one condition should be satified to proceed to next stage  

    *e.g.* (client_code EQ ABC ) AND (division_code IN [ MUMBAI,PUNE,SYDNEY,MELBOURNE ] )  

- **ANY**  
    This is a catch all condition which always passed.

**NOTE:** *There could be one or more conditional branches. The sequence of evaluation of each of the conditional branch depends on the priority set for the given condition*

