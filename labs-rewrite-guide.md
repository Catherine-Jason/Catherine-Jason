# Labs rewrite guide (IT Support Labs 1 to 5 and Automation Labs 1 to 3)

For the VS Code chat: apply this to the lab pages in `catherines-labs/`. Keep the HTML structure, classes, colors, images, buttons, and the script previews exactly as they are. Replace only the text described below, section by section. Do not use dashes or hyphens in any text you add. Where a hyphen sits inside a compound word, write it as two words.

Facts used here come from Catherine. Anything marked CONFIRM is a claim she still has to check before the site goes live. Do not remove CONFIRM items. Leave the marker out of the page but list them in your final reply.

---

## Lab 1: Helpdesk Ticketing Workflow

Page title stays "Lab 1: Helpdesk Ticketing Workflow".

**Overview:** This lab shows how I work a support ticket from the first message to the final note. It is based on the help desk work I do for staff and students at Carroll County Public Schools.

**Real world relevance:** When tickets are sorted well, classrooms and staff spend less time waiting on a broken account or device, and access stays secure.

**Approach**
- I read the ticket to see who it affects and how urgent it is.
- I confirm who the person is before I touch anything on their account.
- I use remote tools to see the problem myself and find the cause.
- I fix the MFA, password, or lockout issue and check that the person can get in.
- I write down what I did and the final status so the next person can pick it up.

**Key Skills Demonstrated**
- Sorting tickets by urgency
- Checking a person's identity before account changes
- Remote troubleshooting and walking users through a fix
- Clear notes when a ticket is closed

**Skill tags:** Helpdesk Triage, Identity Verification, Remote Troubleshooting, Technical Documentation

**Tools and Technologies:** Quick Assist, Remote Desktop, Active Directory, Company Portal, the district ticketing system

**Results and Outcomes**
- I reset MFA and unlocked accounts after confirming who was asking.
- I helped people recover passwords without weakening account security.
- The goal every time was to get the person back to work or class quickly.

---

## Lab 2: Inventory and Asset Management

Change the title to "Lab 2: Inventory and Asset Management" (page title, hero, and card).

**Overview:** This lab shows how I kept track of district devices during the summer rollout. I helped deploy about 6,000 student devices and about 45 administration and teacher devices.

**Real world relevance:** If the inventory is accurate, it is easy to find a device, know who has it, and keep it secure and up to date.

**Approach**
- I found each device by serial number, TS tag, or the person it was assigned to.
- I checked who owned it and what stage of its life it was in.
- I ran updates before a device was handed out again.
- I recorded the changes so the inventory matched the device.
- I got devices ready to be refreshed, reassigned, or retired.

**Key Skills Demonstrated**
- Keeping inventory records accurate
- Tracking a device from deployment to retirement
- Checking that devices are updated and follow policy
- Working with other team members across many sites

**Skill tags:** Asset Lifecycle Management, Compliance Tracking, Endpoint Policy Enforcement, Fleet Deployment

**Tools and Technologies:** The district inventory system, Microsoft Intune, Dell Command Update, imaging and staging steps

**Results and Outcomes**
- At the end of each cycle I scanned devices into inventory by site, so the records stayed current.
- Devices got their updates before they went out.
- Our team reached the goal of about 6,000 new devices in under four weeks.

---

## Lab 3: Account and Access Administration

Change the title to "Lab 3: Account and Access Administration".

**Overview:** This lab shows how I handle account problems while keeping people working and following the rules. It reflects the account work in my current role.

**Real world relevance:** Accounts are one of the first things attackers go after, so every change to one has to be careful.

**Approach**
- I confirmed who the person was and that the request was real before changing anything.
- I reset passwords and MFA through the approved steps.
- I updated user and group settings when the person needed different access.
- I tested the login to make sure access worked again.
- I wrote down every change that touched security.

**Key Skills Demonstrated**
- Safe account recovery after checking identity
- Managing users and groups in Active Directory
- Helping with MFA and password resets
- Matching a person's access to their role

**Skill tags:** Identity Verification, MFA Administration, Active Directory, Role Based Access Control

**Tools and Technologies:** Active Directory, the MFA security info portal, the district User Management System, group and permission settings

**Results and Outcomes**
- I fixed account lockouts and MFA problems without loosening security.
- I kept notes on identity and access changes so they can be checked later.

---

## Lab 4: Enterprise Tools and Portal Navigation

Change the title to "Lab 4: Enterprise Tools and Portal Navigation".

**Overview:** This lab shows how I help people get to the apps they need across the district's systems, including account access, finding apps, and getting software installed.

**Real world relevance:** When people can open their apps, teaching and school work keep going.

**Approach**
- I asked what the problem was and which system it depended on.
- I checked the person's permissions and gave them access to the app when they needed it.
- I walked people through Microsoft 365, Company Portal, and Software Center.
- I checked that the app opened and wrote notes on problems that kept coming back.
- When I could not fix something, I passed it on with clear steps to repeat the problem.

**Key Skills Demonstrated**
- Troubleshooting enterprise apps and guiding users
- Checking permissions and enabling access
- Writing down support steps for staff and student issues
- Explaining technical steps in plain words

**Skill tags:** Enterprise App Support, Microsoft 365, Permission Validation, User Enablement

**Tools and Technologies:** Microsoft 365, the district portals, Company Portal (used on student devices), Software Center (used on staff devices)

**Results and Outcomes**
- I restored access to apps for different groups of users.
- I kept written steps for common problems so they were easier to repeat.

---

## Lab 5: Device Deployment and Imaging

Change the title to "Lab 5: Device Deployment and Imaging".

**Overview:** This lab shows how I prepared and deployed devices during the district rollout, including refreshing old devices and handling the ones that were retired.

**Real world relevance:** A device that is imaged and updated the same way every time is more secure and gets to the user faster.

**Approach**
- I prepared devices with the district image and standard settings.
- I ran imaging and checked that updates and security patches were installed.
- I kept work moving by unboxing and prepping the next batch while the current one reimaged.
- I checked enrollment, software, and sign in before a device went out.
- I handled end of life devices by wiping them, checking them, and tagging them as retired.

**Key Skills Demonstrated**
- Deploying devices in large numbers
- Imaging devices the same way every time
- Checking updates and enrollment before handoff
- Handling devices at the end of their life

**Skill tags:** Endpoint Deployment, Imaging and Configuration, Compliance Verification, Hardware Lifecycle

**Tools and Technologies:** Imaging and deployment checklists, Microsoft Intune, Dell Command Update, Company Portal, Software Center, the district asset system

**Results and Outcomes**
- I helped the team reach the goal of about 6,000 new devices in under four weeks.
- I checked devices before delivery so they were ready when they arrived.
- I followed a clear process to retire old devices securely.

**Photos:** The five photos still load from GitHub links. Catherine will save them into `catherines-labs/img/` as `lab5-1.png` through `lab5-5.png`. Once they are there, point each image at its local file with a short plain alt text. Before that, keep the current links.

---

## Automation Lab 1: PowerShell User Account Audit

Page title, hero, and card title: "Automation Lab 1: PowerShell User Account Audit". Use a colon, not a dash.

**Intro line:** This lab is a PowerShell script that checks Active Directory for old or risky user accounts and saves a CSV report for IT and security to review.

**Overview:** Checking accounts by hand gets slow and uneven as the number of users grows. This script does the check the same way every time and saves the results in a clean report.

**Real world relevance:** Regular account checks help find old accounts and weak password settings before they become a problem. It also supports least privilege.

**Objective**
- Find accounts that have not logged in for 90 days
- Flag accounts where the password is set to never expire, or has already expired
- Record the account status, last logon date, and password flags
- Save the results to a CSV file for IT and compliance to review

(This fixes the old line about passwords that "have never been set." The script checks PasswordNeverExpires and PasswordExpired, not whether a password was ever set.)

**Script Walkthrough**
- I loaded the Active Directory module and set the limit to 90 days.
- I used Get-ADUser to pull the enabled accounts and the fields I needed.
- I compared each last logon date to the limit.
- I kept the accounts that were inactive or had a password setting that needed attention.
- I saved the results to a CSV named with the date.

**Results and Outcomes**
- The script turns a manual review into one command.
- It saves a report that shows which accounts need action.
- It makes old accounts and password exceptions easier to see.
- It is ready to run on a schedule.

(This removes "from hours to seconds." CONFIRM: only add a time back if Catherine measured it.)

Keep Script Preview, Skills, and Tools as they are.

---

## Automation Lab 2: Bash System Health Check

Page title, hero, and card title: "Automation Lab 2: Bash System Health Check".

**Intro line:** This lab is a Bash script that checks CPU, memory, disk, and key services on a Linux machine and prints a status report with the time.

**Overview:** You need to see quickly whether a machine is under pressure or a service has stopped. This script puts those checks into one command that can be repeated.

**Real world relevance:** Spotting a full disk or a stopped service early makes it easier to fix before it causes an outage.

**Script Walkthrough**
- I set limits for CPU, memory, and disk at the top so they are easy to change.
- I used top and awk to get the CPU usage.
- I used free to work out the memory percentage.
- I used df to get the disk usage on the root partition.
- I checked each key service with systemctl is-active and marked it Running or NOT Running.
- I printed a colored summary with the date and time.

**Known limit (add as a new bullet at the end of the Script Walkthrough, in plain words):** The script is set up to write to a log file, but right now only the closing line reaches it. Sending the whole report to the log is my next fix. CONFIRM: if Catherine fixes the script, remove this bullet and say the summary is added to a log file.

**Add one more bullet at the end of the Script Walkthrough:** The service names in the script, ssh and cron, match Debian based systems such as Ubuntu, Kali, and Parrot. On other Linux systems the names can be different.

(Catherine does not remember which Linux system she ran it on, so do not name one as the system she used.)

Keep Objective, Script Preview, Skills, and Tools as they are.

---

## Automation Lab 3: Python Log Parser

Page title, hero, and card title: "Automation Lab 3: Python Log Parser and Report" (the old title said "Alert Script," but the script writes a report and does not send alerts).

**Intro line:** This lab is a Python script that reads a log file, looks for errors and signs of suspicious activity, and writes a summary report.

**Overview:** When a log gets big, it is easy to miss the lines that matter. This script counts each type of event and keeps a few example lines so I know where to start looking.

**Real world relevance:** Scanning logs automatically saves time in a SOC and makes repeat errors and security events easier to notice.

**Script Walkthrough**
- I made a list of patterns to look for, using keywords and regular expressions.
- I opened the log file and read it one line at a time.
- I checked each line against every pattern and saved the line number of each match.
- I counted the matches for each pattern.
- I wrote a report with the date and time and printed a short summary in the terminal.

Keep Objective, Script Preview, Skills, and Tools as they are.

---

## Before publishing, Catherine checks these

1. Read each page once out loud and change anything that does not sound like you.
2. Every item marked CONFIRM above.
3. Nothing in the text or screenshots shows student or staff names, ticket numbers, device serial numbers or TS tags, usernames, or internal web addresses.
4. Save the five Lab 5 photos into `catherines-labs/img/`.
