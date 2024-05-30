import QtQuick 2.0
import QtQuick.Controls 2.5 as QQC2
import org.kde.kirigami 2.4 as Kirigami

Kirigami.FormLayout {
    id: page
  
    property alias cfg_showLabel: showLabel.checked
    property alias cfg_showIcon: showIcon.checked
    property alias cfg_labelText: labelText.text

    QQC2.CheckBox {
        id: showLabel
        Kirigami.FormData.label: i18n("Section:")
        text: i18n("Show label")
    }
    QQC2.CheckBox {
        id: showIcon
        text: i18n("Show icon")
    }
    QQC2.TextField {
        id: labelText
        Kirigami.FormData.label: i18n("Label:")
        placeholderText: i18n("Placeholder")
    }
}
