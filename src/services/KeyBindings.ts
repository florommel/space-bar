import { Shell, Meta } from 'imports/gi';
const Main = imports.ui.main;

import { Settings } from 'services/Settings';
import { Workspaces } from 'services/WorkspacesState';

export class KeyBindings {
    private readonly _settings = Settings.getInstance().extensionSettings;
    private readonly _ws = Workspaces.getInstance();
    private _addedKeyBindings: string[] = [];

    init() {
        this._addActivateKeys();
    }

    destroy() {
        for (const name of this._addedKeyBindings) {
            this._removeKeybinding(name);
        }
        this._addedKeyBindings = [];
    }

    private _addKeyBinding(name: string, handler: () => void) {
        Shell.ActionMode;
        Main.wm.addKeybinding(
            name,
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            handler,
        );
        this._addedKeyBindings.push(name);
    }

    private _removeKeybinding(name: string) {
        Main.wm.removeKeybinding(name);
    }

    private _addActivateKeys() {
        for (let i = 0; i < 10; i++) {
            this._addKeyBinding(`activate-${i + 1}-key`, () => {
                this._ws.activate(i, { focusWindowIfCurrentWorkspace: true });
            });
        }
        this._addKeyBinding('activate-previous-key', () => {
            this._ws.activatePrevious();
        });
    }
}
