# FUEL-316: [Butler] Save Tactic as Draft

## Important Notes

> **UI Reference**: The UI must follow the **Figma specification** exclusively.  
> The prototype (GitHub Pages link) is provided only to demonstrate **functionality and interactions** - do NOT use it as a UI reference. The visual design, spacing, colors, and component styles must all be taken from Figma.
>
> **Copy/Text**: The copy (labels, messages, button texts) is not final yet and will be refined in the Figma specification. Please check Figma for the latest approved copy before implementation.

**Figma Specification**: [Fuel 1.4 :: [Butler] Save Tactic as Draft](https://www.figma.com/design/9uSZLmMJtaKmiUvozhSPPu/%F0%9F%9A%A7-Fuel-specifications-%E2%80%94-in-progress?node-id=18419-159441&m=dev)

**Prototype (functionality only)**: [https://jan-cermak-1.github.io/butler-tactics-templates-improvement/](https://jan-cermak-1.github.io/butler-tactics-templates-improvement/)

---

## Overview

This feature allows users to save changes to tactics as drafts before publishing them to production. Changes are auto-saved, and users can review and publish when ready.

---

## Changes Required (Numbered List)

### A. Tactics Table Changes

1. **Add "DRAFT" badge** next to tactic name for tactics that have never been published
   - Badge style: gray background, "DRAFT" text
   - Position: immediately after tactic name in the name cell

2. **Add "MODIFIED" badge** next to tactic name for published tactics with unpublished changes
   - Badge style: yellow/orange background, "MODIFIED" text
   - Position: immediately after tactic name in the name cell

3. **Add new "Active" column** with toggle switch
   - Column position: after tactic name column
   - Shows current active/inactive state
   - Toggle is interactive (can activate/deactivate from table)

4. **Add new "Best practices" column**
   - Shows count of best practices linked to tactic
   - Position: after Active column

5. **Add new "Linked Objectives" column**
   - Shows count of linked objectives
   - Position: after Best practices column

6. **Implement sticky table header** on scroll
   - Table header should remain fixed at top when scrolling through tactics

7. **Update table row states**
   - Normal state (active tactic)
   - Inactive tactic state (grayed out appearance)
   - Hover state with background highlight

---

### B. Filter Side Panel Changes

8. **Add new "Publishing" filter section** with radio button options:
   - All (default)
   - Up to date
   - Modified
   - Draft

9. **Keep existing "Status" filter section** with options:
   - All
   - Active
   - Inactive

10. **Add "Industry" dropdown filter**
    - Multi-select dropdown
    - Placeholder: "Select industry..."

11. **Add "Best practices" filter section** with radio buttons:
    - All (default)
    - No best practices

12. **Add "Linked objectives" filter section** with radio buttons:
    - All (default)
    - No linked objectives

13. **Add "Reset filters" link button** in filter panel footer

---

### C. Tactic Editor Header - Complete Redesign

14. **Replace "Close" button with "X" icon button**
    - Position: left side of header
    - Action: close editor and return to tactics list

15. **Add tactic name display** with truncation
    - Show tactic name (truncated with "..." if too long)
    - Position: after close button

16. **Add "DRAFT" badge** next to tactic name
    - Show only for unpublished tactics
    - Badge style: gray background

17. **Add "MODIFIED" badge** next to tactic name
    - Show only for published tactics with unsaved changes
    - Badge style: yellow/orange background

18. **Add edit button (pencil icon)** next to tactic name
    - Action: opens existing "Edit Tactic" modal (no changes to modal needed)

19. **Add publishing status text** showing current state:
    - "Created" - new draft, never saved
    - "Saving..." - autosave in progress
    - "Saved (not published)" - changes saved as draft
    - "Publishing..." - publish in progress
    - "Published" - all changes published

20. **Add "Active" toggle switch**
    - Position: after status text
    - Label: "Active"
    - Shows/controls active state of tactic

21. **Add "Preview" toggle switch**
    - Position: after Active toggle
    - Label: "Preview"
    - Toggles preview mode

22. **Replace "Save tactic" button with "Publish" button**
    - Primary button style (blue background)
    - Action: publish all draft changes

23. **Add "..." (more actions) icon button**
    - Position: after Publish button
    - Action: opens dropdown menu

---

### D. Header Responsiveness

24. **Implement responsive header layout**
    - Tactic name truncates with ellipsis when space is limited
    - All controls remain accessible at different viewport widths

25. **Handle long tactic names**
    - Maximum displayed characters before truncation
    - Full name shown in tooltip on hover

---

### E. Dropdown Menu (More Actions)

26. **Create dropdown menu** with following items:
    - **Edit** - opens existing Edit Tactic modal (no changes to modal needed)
    - **Duplicate** - creates copy of tactic
    - **Discard changes** - reverts to last published version (only shown when modified)
    - **Remove** - deletes tactic (with confirmation)

27. **Menu item states**
    - "Discard changes" only visible when tactic has unpublished changes
    - All items have hover state

---

### F. New Modals

28. **"Publish to activate" Modal**
    - Trigger: when user tries to activate a draft tactic
    - Title: "Publish to activate"
    - Message: "This tactic is currently a draft. To activate it, you need to publish it first."
    - Buttons: "Cancel" (secondary), "Publish & activate" (primary)

29. **"Deactivate tactic" Confirmation Modal**
    - Trigger: when user tries to deactivate an active tactic
    - Title: "Do you want to deactivate tactic?"
    - Message: "This tactic is linked to objectives. Deactivating it may affect their performance."
    - Buttons: "Cancel" (secondary), "Deactivate" (primary/danger)

30. **"Remove tactic" Confirmation Modal**
    - Trigger: when user selects "Remove" from dropdown menu
    - Title: "Do you want to remove tactic?"
    - Message: "This action cannot be undone. Removing this tactic may break the objectives that use this template."
    - Buttons: "Cancel" (secondary), "Remove" (danger/red)

---

### G. Snackbar Notifications

31. **Success snackbar - "Tactic published and activated"**
    - Green left border
    - Show after successful publish + activate action

32. **Success snackbar - "Tactic published"**
    - Green left border
    - Show after successful publish action

33. **Success snackbar - "Tactic activated"**
    - Green left border
    - Show after successful activation

34. **Success snackbar - "Tactic deactivated"**
    - Green left border
    - Show after successful deactivation

35. **Success snackbar - "Tactic duplicated"**
    - Green left border
    - Show after successful duplication

36. **Success snackbar - "Changes discarded"**
    - Green left border
    - Show after successful discard changes action

37. **Success snackbar - "Tactic removed"**
    - Green left border
    - Show after successful removal

38. **Error snackbar variants**
    - Red left border
    - Show when any action fails
    - Include error message from API

---

### H. Autosave Functionality

39. **Implement autosave for all changes**
    - Automatically save changes as draft after user stops typing (debounce ~1-2 seconds)
    - No manual "Save" action required

40. **Show "Saving..." status** during autosave
    - Display in header status area
    - Optional: subtle loading indicator

41. **Show "Saved (not published)" status** after autosave completes
    - Indicates changes are saved but not published

42. **Persist draft state** across sessions
    - User should see their unpublished changes when returning to editor

---

### I. Publishing Flow

43. **Clicking "Publish" button** publishes all draft changes
    - Show "Publishing..." status during API call
    - Show "Published" status after success
    - Show error snackbar on failure

44. **Update badges after publish**
    - Remove "DRAFT" badge (tactic is now published)
    - Remove "MODIFIED" badge (changes are now published)

45. **Update table row** to reflect published state
    - Remove DRAFT/MODIFIED badge from table view

---

### J. Activation Flow

46. **Activating a draft tactic** shows "Publish to activate" modal
    - User must publish before activating

47. **Activating a published tactic** activates immediately
    - Show success snackbar

48. **Deactivating a tactic** behavior:
    - If tactic IS linked to objectives → show "Deactivate tactic" confirmation modal
    - If tactic is NOT linked to objectives → deactivate immediately without modal, show success snackbar

---

### K. Discard Changes Flow

49. **"Discard changes" action** reverts to last published version
    - Only available for modified tactics (not for drafts)
    - Shows success snackbar after completion
    - Updates status to "Published"
    - Removes "MODIFIED" badge

---

### L. Duplicate Flow

50. **"Duplicate" action** creates a copy of the tactic
    - New tactic gets "DRAFT" status
    - New tactic name: "[Original name] (copy)"
    - Shows success snackbar
    - Stay on current tactic (do NOT navigate to duplicated tactic)

---

### M. Remove Flow

51. **"Remove" action** shows confirmation modal
    - On confirm: delete tactic and return to list
    - Shows success snackbar
    - On cancel: close modal, no action

---

## Summary of New UI Components

| Component | Type | Description |
|-----------|------|-------------|
| DRAFT badge | Badge | Gray badge for unpublished tactics |
| MODIFIED badge | Badge | Yellow badge for modified published tactics |
| Active toggle | Toggle | In header and table |
| Preview toggle | Toggle | In header |
| Publish button | Button | Primary action button |
| More actions dropdown | Dropdown | Edit, Duplicate, Discard, Remove |
| Publish to activate modal | Modal | Confirmation for activating drafts |
| Deactivate modal | Modal | Confirmation with warning |
| Remove modal | Modal | Confirmation with danger action |
| Filter side panel | Panel | Extended with Publishing filters |
| Snackbars | Toast | Success/error notifications |

---

## States Overview

### Tactic States
- **Draft** - Never published, has DRAFT badge
- **Published** - All changes are live, shows "Published" status
- **Modified** - Published but has unpublished changes, has MODIFIED badge

### Header Status States
- Created
- Saving...
- Saved (not published)
- Publishing...
- Published

### Active States
- Active (toggle ON)
- Inactive (toggle OFF)

---

## Edge Cases & Error Handling

### Autosave Errors
- If autosave fails, show error snackbar with message
- Keep "Saving..." status visible, retry automatically after 5 seconds
- User can continue editing during retry

### Network Errors
- If Publish fails → show error snackbar, keep draft state, user can retry
- If Activate/Deactivate fails → show error snackbar, revert toggle to previous state
- If Remove fails → show error snackbar, close modal, tactic remains

### Concurrent Editing
- If another user publishes the same tactic → on next autosave, show conflict notification
- (Future consideration - not required for MVP)

### Closing Editor
- Since autosave is implemented, closing editor (X button) should work without warning
- All changes are automatically saved as draft

---

## Acceptance Criteria

- [ ] All 51 numbered items implemented
- [ ] UI matches Figma specification exactly
- [ ] Autosave works reliably
- [ ] All modals have proper confirmation flows
- [ ] Snackbars appear for all actions
- [ ] Filter panel includes all new filters
- [ ] Badges display correctly in table and header
