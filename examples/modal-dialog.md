# Modal Dialog

**Task:** "Add a modal dialog for the delete confirmation."

## Without Ponytail

```bash
npm install @radix-ui/react-dialog
# or: npm install react-modal
```

```jsx
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export function DeleteModal({ onConfirm, onCancel }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="btn-danger">Delete</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>Confirm deletion</Dialog.Title>
          <Dialog.Description>This action cannot be undone.</Dialog.Description>
          <div className="dialog-actions">
            <Dialog.Close asChild>
              <button onClick={onCancel}>Cancel</button>
            </Dialog.Close>
            <button className="btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

For a basic confirmation, a native dialog may suffice. An existing component can still earn its place through required interaction, design-system integration, or accessibility behavior.

## With Ponytail

```html
<dialog id="confirm-delete" aria-labelledby="confirm-title" aria-describedby="confirm-description">
  <h2 id="confirm-title">Confirm deletion</h2>
  <p id="confirm-description">This action cannot be undone.</p>
  <button id="cancel">Cancel</button>
  <button id="confirm">Delete</button>
</dialog>
```

```js
const dialog = document.getElementById("confirm-delete");
document.getElementById("cancel").onclick = () => dialog.close();
document.getElementById("confirm").onclick = () => { onConfirm(); dialog.close(); };

// Open it:
dialog.showModal();
```

This illustrates the native primitive, not a complete drop-in React replacement. Check target support, focus entry/return, accessible naming, Escape/cancel callbacks, and confirmation error handling. The sample assumes a synchronous confirmation; retain needed pending/error states for async deletion. Native behavior alone does not establish accessibility or contract equivalence.
