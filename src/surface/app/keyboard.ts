import { useSearchBox } from "rich/extensions/search/keyword"
import { KeyboardCode } from "rich/src/common/keys"
import { surface } from "./store"

export function GlobalKeyboard() {
    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrl(KeyboardCode.P),
        (ev) => {
            ev.preventDefault()
            useSearchBox({ ws: surface.workspace })
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrl(KeyboardCode.S),
        (event, kt) => {
            event.preventDefault()
            if (surface.supervisor?.page?.page)
                surface.supervisor?.page?.page.onPageSave();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrl(KeyboardCode["\\"]),
        (event, kt) => {
            event.preventDefault();
            surface.onToggleSln();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrlAndShift(KeyboardCode.N),
        (event, kt) => {
            event.preventDefault();
            surface.sln.onNewPage();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrl(KeyboardCode["["]),
        (event, kt) => {
            event.preventDefault();
            history.back();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrl(KeyboardCode["]"]),
        (event, kt) => {
            event.preventDefault();
            history.forward();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrl(KeyboardCode.R),
        (event, kt) => {
            event.preventDefault();
            location.reload();
        }
    )


    surface.keyboardPlate.listener(kb => kb.isAlt(KeyboardCode['`']),
        (ev, kt) => {
            ev.preventDefault();
            surface.supervisor.changeSlideOrDialogToPage();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isAlt(KeyboardCode.Q),
        (ev, kt) => {
            ev.preventDefault();
            surface.supervisor.closeDialogOrSlide();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isAlt(KeyboardCode.F),
        (ev, kt) => {
            ev.preventDefault();
            surface.supervisor.openDialogOrSlideToPage();
        }
    )

    surface.keyboardPlate.listener(kb => kb.isMetaOrCtrlAndShift(KeyboardCode.H) ||
        kb.isMetaOrCtrl(KeyboardCode.Z) ||
        kb.isMetaOrCtrl(KeyboardCode.Y) ||
        kb.isMetaOrCtrl(KeyboardCode.D) ||
        kb.isMetaOrCtrlAndAlt(KeyboardCode.M) ||
        kb.isMetaOrCtrl(KeyboardCode.L)||
        kb.isMetaOrCtrl(KeyboardCode.I)
        
        ,(ev, kt) => {

            ev.preventDefault()

        })


}
