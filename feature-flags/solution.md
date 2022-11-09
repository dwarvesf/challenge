## **Introduction**:

- Currently, almost software is running stably, but users want to upgrade some functions or develop new features. After deciding to do a new function, the installation and testing process took a long time to ensure that the new function works well and matches the needs of the user, without having to change too much. After developing the new feature, we will let some users use this function, others will still use the current version of the application.
- In the process of developing new features, still ensuring the development and upgrading of old functions

![](https://i.imgur.com/m518HUm.png)
A simple way to do this is create a product branch that goes from the current branch and develops in parallel into 2 different products, but then managing and merging the code will be complicated and also very difficult. to manage as well as cost to develop 2 versions at the same time.
Thus we arise a requirement that allows the developer to change the operation of the application, the flow, the interface or the processing features without having to modify the code. To make it easy to imagine it as if you use facebook with many features that it is only suitable for a certain number of users, or software versions with advanced features for paid users...
The problem sounds complicated like how to determine which users are used, which functions are used or not, how data is stored and returned to ensure security and not affect the data. Current function...
However, we can divide it into many levels to implement this function such as installation at the application interface, installation at the api layer, installation at the database layer and deeper at the hardware level.

So to store this information, where will we store and it, what solution:

- Solution 1: The flags are stored in the code, each change needs to rebuild the source code and deploy to the end user, this way will cost money and effort to deploy
- Solution 2: The flags are stored in the application's config, for example, config on a web server, web hosting, app config, and env in node js code ... this way will require the user to reload the application and will be difficult to manage
- Solution 3: Self builds a feature flag system, build a flag admin portal, and the necessary services to operate a flag management page
- Solution 4: Use the feature flag service from an external service.


## Solution

### Solution 1

For basic functions or do not need to be turned on and off often, not applicable to different sets of customers, so the setting here is quite simple. You can create a flag in the source code to turn it on and off.

```jsx
function showWelcome() {

// ... old UI welcome

}

function showWelcomeV2() {

// Show UI welcome version 2, work in progress

}

// Old code before setup feature flag

function showUIWelcome() {

showWelcome() // Show UI cũ

}

// Feature flag

function showUIWelcome() {

// config feature flag SHOW_NEW_WELCOME

const SHOW_NEW_WELCOME = true;

if (SHOW_NEW_WELCOME) {

showWelcomeV2()

} else {

showWelcome()

}

}
```

### **Solution 2**

For functions that are likely to change periodically or under certain conditions that you can manage or plan, you can save those settings in an environment variable. In today's source code platforms all allow you to configure environment variables dynamically and allow to relaunch or reload environment variables dynamically. In addition, this approach is suitable for small systems, the operator has good system administration ability. However, it is important to pay attention to security requirements when setting flags as well as re-testing

- **Advantages**
    - Simple, easy to deploy with most platforms
    - Fast deployment time
    - Low deployment cost
- **Defect**
    - Limited features, It only responds to turning on and off functions in a basic way
    - Does not guarantee security requirements

**Implement guideline:**

Create config in env something like that:

```
SHOW_REFERRAL_SCREEN=true
SHOW_MENU_SCREEN=true
SHOW_RESET_SCREEN=false

```

```
function showUIRefferral() {
    if(env.SHOW_REFERRAL_SCREEN){
        // ... UI referral
    } else {
        // show UI empty
    }
}
```

### **Solution 3**

For medium to large projects with a good development team wishing to build feature flag functionality for long-term use with our products and services, the self-development option should be implemented. To develop a module like this the team will need to very clearly define the needs of the service, and analyze the fully functional design.

- **Advantages**
    - Actively develop according to demand
    - Easy to upgrade according to the design of the project
    - Our system can scale and maintain easier
    - Cost won’t increase so fast after our app has been scale
    - Developers can merge and release their new feature code without waiting too long to be merged, and user experiments won’t be affected after release ⇒ CI/CD
- **Defect**
    - Development costs
    - Functions are not rich
    - Long development time
    - Cost of personnel to operate the infrastructure system, automatically scaling

**Implement guideline:**

**Approaches**

- Implement authorization system with Module based for **none authentication** application
- Implement authorization system with Module based plus user role based if needed for **authentication** application

**Pros**

- We can easy to custom with more complex requirements later
- Easy to scale and decrease cost when compared to 3rd party

**Cons**

- Take time to init and implement in DevOps, Backend, Frontend, and Admin to manage
- With small we can’t hit deadline or we have to accept tech debt later

**What could go wrong?**

- We can take too much time to implement our own system and get results not as expected when lack resource and time

**Design own system**

**Database**

Database name: Authorization
**List of tables**

[Diagram for feature flag](https://dbdiagram.io/d/635d532f5170fb6441bbde98)
![](https://i.imgur.com/bZkNyXN.png)
Diagram for feature flag

**System architecture**

![System diagram](https://i.imgur.com/HHb2c0t.png)
**Infrastructure**

**Backend**

**Database migration**

Follow the diagram above to write a migration
**API endpoint**

- CRUD for Admin
    - Need to broadcast to socket channel on each action
- **get-enabled-feature-flags** endpoint to return list to FE App based on authentication

**Socket**

- Enable socket to help FE join to channel and listen topic
- Send socket event to FE after changing anything effect to feature flag

**Middleware**

Input for middleware is a list of conditions with condition key and value, we will implement to get list of feature flags are enabled for these conditions

**Flow to get feature flags base on condition inputs**

![](https://i.imgur.com/Pv1DJ3d.png)

**Flow to check condition is true or false in detail**

![](https://i.imgur.com/j30A35J.png)

**Example**

Old men, children, and women OR man between 20 → 40 can see feature flag A

1. Create feature flag: Name + Key
2. List and select existing triggers if not
3. Create the first trigger
    1. List variables
    
        
        
        | Name | Variable Key | Variable Type |
        | --- | --- | --- |
        | Age | age | number |
        | Sex | sex | enums |
        
    2. List condition
    
    | Name | Variable Key | Condition Type | Value |
    | --- | --- | --- | --- |
    | Children | age | less_than_to_equal | 16 |
    | Old | age | greater_than_to_equal | 60 |
    | Woman | sex | equal | woman |
    
    c. Create trigger: Name + Description + list conditions
    
4. Create the second trigger
    1. List variables
    
        
        
        | Name | Variable Key | Variable Type |
        | --- | --- | --- |
        | Age | age | number |
        | Sex | sex | enums |
        
    2. List condition
    
    | Name | Variable Key | Condition Type | Value |
    | --- | --- | --- | --- |
    | Man Min | age | less_than_to_equal | 40 |
    | Man Max | age | greater_than_to_equal | 20 |
    | Woman | sex | equal | man |
    
    c. Create trigger: Name + Description + list conditions
    
5. Add these triggers to the feature flag A

**Middleware**

1. Get information
2. Create list input conditions want to get feature flags: [{key: “age”, value: 35}, {key: “sex”, value: “man}]
3. SELECT * FROM variables v WHERE v.key in [”age”, “sex”]
4. SELECT * from conditions c WHERE c.variable_id in [variable_ids]
5. Get a list of true conditions
6. SELECT * from triggers_conditions tc WHERE tc.condition_id in [true_condition_ids]
7. Loop triggers → filter trigger has all conditions in the trigger are a subset in true_condition_ids
8. SELECT * from triggers_flags tf WHERE tt.trigger_id in [enabled_trigger_ids]
9. Return list of enabled unique feature flags

**Admin system**

For Homepage

![](https://i.imgur.com/Fr9pDDF.png)

For create feature flag

![](https://i.imgur.com/L0IhgCv.png)

For create trigger

![](https://i.imgur.com/Fr9pDDF.png)

**Frontend Apps**

**Prerequisites**

- The backend and Frontend need to define list of feature flag key before. If we define before we can implement independency

**Implementation**

- FE Call to BE to get the list of available feature flags
- Save a list of available feature flags to context state or local storage
- Create util function isAllowFeature(’feature_key’) → rendering condition

### **Solution 4**

For small and medium projects or MVP products that are in the process of testing, it is recommended to use support solutions from appropriate service providers to optimize development time and operating costs. as well as can quickly use many outstanding features compared to installing it yourself

- **Advantages**
    - Low service cost if there are few people using the service
    - Many advanced functions
    - Rapid deployment
    - Multi-platform support with SDK
    - Real-time toggle feature
    - Support decentralization of management
- **Defect**
    - Service costs can be high when scale many users using the service
    - Unable to design the specific requirements of the project
    - Can’t solve some special requirement when improving feature

**Implementation guidelines:**

Setup code on frontend for each feature

```jsx
// To use in your project, import the initialize function
import { initialize } from '@devcycle/devcycle-js-sdk'

// The user object needs either a user_id, or isAnonymous set to true
const user = { user_id: 'my_user' }
let dvcClient

try {
  // Call initialize with the client key and a user object
  // await on the features to be loaded from our servers
  const dvcClient = await initialize('dvc_client_f895833e_2f80_4631_828f_e2fd5dc0f27b_23918a1', user)
                          .onClientInitialized()
  
  useDVCVariable()
} catch(ex) {
  console.log('Error initializing DVC: ${ex}')
}

function useDVCVariable() {
  if (!dvcClient) return
  
  // Fetch variable values using the identifier key coupled with a default value
  // The default value can be of type string, boolean, number, or object
  const dvcVariable = dvcClient.variable('liquidity-pool', false)
  if (dvcVariable.value) {
    // Put feature code here, or launch feature from here
  } else {
    // Put feature code here, or launch feature from here
  }
  
  // Register a callback to be notified when a value is updated
  dvcVariable.onUpdate((value) => {
    // updated variable value is available
  })
}
```

- Create a new feature flag, Select

![](https://i.imgur.com/DSRtaFL.png)


- Define feature flag name

![](https://i.imgur.com/fbkXKRL.png)

- Add a condition to feature flag

![](https://i.imgur.com/YpRNvKR.png)

| Feature | Solution 1: Config flag in source code | Solution2: Setup config in environment | Solution 3:Build a feature flag management system | Solution 4: 3party Feature flag service |
| --- | --- | --- | --- | --- |
| Actively develop according to demand | x |  |  |  |
|  Easy to upgrade according to the design of the project | x |  |  |  |
| Our system can scale and maintain easier | x |  |  |  |
| Cost won’t increase so fast after our app has been scale | x |  |  |  |
|  |  |  |  |  |