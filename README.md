### Esign App

Esign doc app

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app esign_app
```

eSign - Digital Signature Platform✍️🔒

Use of eSign in the Project🎯

eSign is an integral part of your platform, allowing for the efficient and secure signing of documents digitally. Its role spans across various modules, streamlining the document signing process and providing features for customization, user assignment, and tracking document statuses.

What is eSign?🤔

eSign is a digital signature platform that allows users to securely sign documents online. It eliminates the need for manual signatures by digitizing the entire process, ensuring that documents are legally binding and tamper-proof.

What Can We Do with eSign?💡

With eSign, users can:

🖋️Store signatures for future use, either by drawing them or uploading a PNG image.

📄 Create reusable templates for documents, which can include various elements like text, checkboxes, dates, and signatures.

👥 Assign components to users, ensuring that only authorized users can interact with specific parts of a document.

✉️ Send documents to designated users for review and signing.

👀 Track document statuses in real-time, knowing when documents are opened, signed, or completed.

🖨️ Print finalized documents once all signatures and inputs are completed, with all components merged into the base PDF.

Modules and Working Flow 🛠️

1. Signature Module ✍️

Users can store their signatures (drawn or uploaded) for later use.

The signatures are saved in a repository and can be reused when signing documents.

Option to upload a PNG signature or draw one directly on the platform.

Use Case: When a user is assigned a signature component, the saved signature can be applied effortlessly.

2. Template Module 📝

Create blueprints (templates) for documents that can be reused multiple times.

Add components like Text, Signature, Checkbox, Date, and Image.

Assign users to specific components (e.g., signatures) or leave components unassigned for later assignment.

Base PDF acts as a background on which users can place components page-wise.

Use Case: Instead of recreating similar documents, users can load a template, adjust components, and assign specific users to sign or fill in sections.

3. Document Module 📑

Users can create a document by selecting a template, filling in or modifying components as needed.

Users can edit components without affecting the original template.

Once complete, users can send the document via email, and the system automatically pulls in the assigned users’ emails.

Notification emails are sent to the recipients, informing them about the document.

Use Case: A client or team member is sent a document with components already assigned. They receive the document, input their data, and sign where required.

4. Sent Module (Tentative Name) 🚚

This module tracks all sent documents.

Displays each document’s global status (Unseen, Open, Close).

A tooltip or hover action reveals the users assigned to each component and their status.

Once all assigned users complete their actions, the global status updates accordingly.

Use Case: The document’s progress can be tracked in real-time. If a user hasn’t seen the document, the status remains 'unseen' with a yellow indicator.

5. Inbox Module 📥

Displays documents assigned to the user, categorized by their current status (Unseen, Open, Closed).

Unseen documents show a yellow spot, open ones show normally, and closed ones have a lower visibility.

Clicking a document shows the PDF preview on the left and the input controllers on the right.

When the user interacts with components, the relevant section of the PDF highlights and scrolls to the correct page.

Preview mode is enabled after all inputs are completed, with the print button becoming active once the document is fully completed by all users.

Use Case: Users can easily identify and complete their assigned tasks, with a smooth interface that allows them to navigate directly to their sections.

Screenshot Workflow

Signature Module: Show the signature drawing/upload interface and the repository of stored signatures.

Template Module: Display the base PDF and how users can add components, set assignments, and save the template.

Document Module: Capture the document creation process, the edit mode, and the email sending interface.

Sent Module: Show the list of sent documents, global status indicators, and hover functionality that reveals component assignments.

Inbox Module: Visualize the document statuses (yellow spots for unseen), the PDF preview on the left, and the input controllers on the right.

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/esign_app
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License

mit
