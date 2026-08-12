export const supportedLocales = ['en', 'fr', 'it', 'es', 'de'] as const

export type Locale = (typeof supportedLocales)[number]

export const LOCALE_STORAGE_KEY = 'watermark-id:locale'

const en = {
  pageTitle: 'Watermark ID — Private document watermarking',
  metaDescription: 'Watermark identity documents privately in your browser.',
  language: 'Language',
  home: 'Watermark ID home',
  imagesStayLocal: 'Images never leave this device',
  onDeviceOnly: 'On-device only',
  privateByDesign: 'Private by design',
  heroLead: 'Share your ID.',
  heroAccent: 'Keep control.',
  heroDescription: 'Crop and watermark sensitive documents without sending them anywhere. Everything happens on this device.',
  addPhotos: 'Add your ID photos',
  addPhotosDescription: 'Choose one image, or select several to process as a batch.',
  choosePhoto: 'Choose photo',
  takePhoto: 'Take photo',
  fileHint: 'JPEG, PNG or WebP · up to 40 MB',
  privacyDetails: 'Privacy details',
  noUploads: 'No uploads',
  worksOffline: 'Works offline',
  noTracking: 'No tracking',
  privateOfflineYours: 'Private. Offline. Yours.',
  imageUnreadableNamed: '{name} could not be read.',
  maxFileSize: 'Each image must be 40 MB or smaller.',
  chooseSupported: 'Choose JPEG, PNG or WebP images.',
  imagesUnreadable: 'The selected images could not be read.',
  skippedOne: '1 unsupported or oversized file was skipped.',
  skippedMany: '{count} unsupported or oversized files were skipped.',
  batchAdded: '{count} images added. Your current settings apply to the whole batch.',
  oneImageUnreadable: 'One of the images could not be read.',
  presetSavedNotice: 'Default preset saved on this device.',
  presetSaveError: 'This browser could not save the preset.',
  presetRestoredNotice: 'Default preset restored.',
  enterCompany: 'Enter the target company before exporting your ID.',
  savedNotice: 'Saved to your device.',
  batchSavedNotice: '{count} watermarked IDs saved in one ZIP.',
  exportError: 'The images could not be exported.',
  sharingUnavailable: 'File sharing is not available here. Download the image instead.',
  shareTitle: 'Watermarked ID',
  sharedNotice: 'Shared securely from your device.',
  shareError: 'The image could not be shared.',
  documentPreview: 'Document preview',
  batch: 'Batch',
  batchNavigation: 'Batch image navigation',
  previousImage: 'Previous image',
  nextImage: 'Next image',
  positionOfTotal: '{position} of {total}',
  adding: 'Adding…',
  add: 'Add',
  removeImage: 'Remove current image',
  renderedLocally: 'Preview rendered locally',
  idsPrivateBatch: '{count} IDs · one private batch',
  idStaysPrivate: 'Your ID stays private',
  processedInBrowser: 'Processed entirely in this browser',
  share: 'Share',
  preparingCount: 'Preparing {count}…',
  preparing: 'Preparing…',
  downloadBatch: 'Download batch ({count})',
  downloadId: 'Download watermarked ID',
  dismiss: 'Dismiss message',
  watermarkSettings: 'Watermark settings',
  customize: 'Customize',
  watermark: 'Watermark',
  defaultPreset: 'Default preset',
  appliedEveryImage: 'Applied to every image',
  restoreDefaultPreset: 'Restore saved default preset',
  restorePreset: 'Restore saved preset',
  saved: 'Saved',
  update: 'Update',
  saveDefault: 'Save default',
  details: 'Details',
  targetCompany: 'Target company',
  companyExample: 'e.g. Northstar Bank',
  purpose: 'Purpose',
  defaultPurpose: 'Identity verification',
  date: 'Date',
  includeDate: 'Include date',
  pattern: 'Pattern',
  watermarkPattern: 'Watermark pattern',
  diagonal: 'Diagonal',
  rows: 'Rows',
  focus: 'Focus',
  opacity: 'Opacity',
  textSize: 'Text size',
  spacing: 'Spacing',
  angle: 'Angle',
  color: 'Color',
  useColor: 'Use {color} watermark',
  chooseCustomColor: 'Choose a custom color',
  customColor: 'Custom watermark color',
  cardCrop: 'Credit card crop',
  useCardCrop: 'Use credit card crop',
  cardProportions: 'ISO/IEC 7810 ID-1 proportions · 85.60 × 53.98 mm',
  zoom: 'Zoom',
  resetCrop: 'Reset crop',
  export: 'Export',
  exportFormat: 'Export format',
  quality: 'Quality',
  output: 'Output',
  previewCrop: 'Watermarked ID preview. Drag to reposition the crop.',
  preview: 'Watermarked ID preview',
  dragToReposition: 'Drag to reposition',
} as const

type TranslationKey = keyof typeof en
type TranslationSet = Record<TranslationKey, string>

const fr: TranslationSet = {
  pageTitle: 'Watermark ID — Filigrane privé pour documents', metaDescription: 'Ajoutez un filigrane à vos pièces d’identité en toute confidentialité dans votre navigateur.', language: 'Langue', home: 'Accueil de Watermark ID', imagesStayLocal: 'Les images ne quittent jamais cet appareil', onDeviceOnly: 'Uniquement sur l’appareil', privateByDesign: 'Confidentiel par conception', heroLead: 'Partagez votre pièce d’identité.', heroAccent: 'Gardez le contrôle.', heroDescription: 'Recadrez et filigranez vos documents sensibles sans les envoyer nulle part. Tout se passe sur cet appareil.', addPhotos: 'Ajoutez vos photos d’identité', addPhotosDescription: 'Choisissez une image ou sélectionnez-en plusieurs pour les traiter par lot.', choosePhoto: 'Choisir une photo', takePhoto: 'Prendre une photo', fileHint: 'JPEG, PNG ou WebP · jusqu’à 40 Mo', privacyDetails: 'Informations de confidentialité', noUploads: 'Aucun envoi', worksOffline: 'Fonctionne hors ligne', noTracking: 'Aucun suivi', privateOfflineYours: 'Privé. Hors ligne. À vous.', imageUnreadableNamed: 'Impossible de lire {name}.', maxFileSize: 'Chaque image doit faire 40 Mo maximum.', chooseSupported: 'Choisissez des images JPEG, PNG ou WebP.', imagesUnreadable: 'Impossible de lire les images sélectionnées.', skippedOne: '1 fichier non pris en charge ou trop volumineux a été ignoré.', skippedMany: '{count} fichiers non pris en charge ou trop volumineux ont été ignorés.', batchAdded: '{count} images ajoutées. Vos réglages actuels s’appliquent à tout le lot.', oneImageUnreadable: 'Impossible de lire l’une des images.', presetSavedNotice: 'Préréglage par défaut enregistré sur cet appareil.', presetSaveError: 'Ce navigateur n’a pas pu enregistrer le préréglage.', presetRestoredNotice: 'Préréglage par défaut restauré.', enterCompany: 'Saisissez l’entreprise destinataire avant d’exporter votre pièce d’identité.', savedNotice: 'Enregistré sur votre appareil.', batchSavedNotice: '{count} pièces d’identité filigranées enregistrées dans un fichier ZIP.', exportError: 'Impossible d’exporter les images.', sharingUnavailable: 'Le partage de fichiers n’est pas disponible ici. Téléchargez plutôt l’image.', shareTitle: 'Pièce d’identité filigranée', sharedNotice: 'Partagé en toute sécurité depuis votre appareil.', shareError: 'Impossible de partager l’image.', documentPreview: 'Aperçu du document', batch: 'Lot', batchNavigation: 'Navigation dans le lot d’images', previousImage: 'Image précédente', nextImage: 'Image suivante', positionOfTotal: '{position} sur {total}', adding: 'Ajout…', add: 'Ajouter', removeImage: 'Supprimer l’image actuelle', renderedLocally: 'Aperçu généré localement', idsPrivateBatch: '{count} pièces · un lot privé', idStaysPrivate: 'Votre pièce d’identité reste privée', processedInBrowser: 'Traitement entièrement réalisé dans ce navigateur', share: 'Partager', preparingCount: 'Préparation de {count}…', preparing: 'Préparation…', downloadBatch: 'Télécharger le lot ({count})', downloadId: 'Télécharger la pièce filigranée', dismiss: 'Fermer le message', watermarkSettings: 'Réglages du filigrane', customize: 'Personnaliser', watermark: 'Filigrane', defaultPreset: 'Préréglage par défaut', appliedEveryImage: 'Appliqué à chaque image', restoreDefaultPreset: 'Restaurer le préréglage par défaut enregistré', restorePreset: 'Restaurer le préréglage enregistré', saved: 'Enregistré', update: 'Mettre à jour', saveDefault: 'Enregistrer par défaut', details: 'Détails', targetCompany: 'Entreprise destinataire', companyExample: 'ex. Banque Northstar', purpose: 'Motif', defaultPurpose: 'Vérification d’identité', date: 'Date', includeDate: 'Inclure la date', pattern: 'Motif du filigrane', watermarkPattern: 'Disposition du filigrane', diagonal: 'Diagonale', rows: 'Lignes', focus: 'Centré', opacity: 'Opacité', textSize: 'Taille du texte', spacing: 'Espacement', angle: 'Angle', color: 'Couleur', useColor: 'Utiliser la couleur {color} pour le filigrane', chooseCustomColor: 'Choisir une couleur personnalisée', customColor: 'Couleur personnalisée du filigrane', cardCrop: 'Recadrage au format carte', useCardCrop: 'Utiliser le recadrage au format carte', cardProportions: 'Proportions ISO/IEC 7810 ID-1 · 85,60 × 53,98 mm', zoom: 'Zoom', resetCrop: 'Réinitialiser le recadrage', export: 'Exporter', exportFormat: 'Format d’exportation', quality: 'Qualité', output: 'Sortie', previewCrop: 'Aperçu de la pièce filigranée. Faites glisser pour repositionner le recadrage.', preview: 'Aperçu de la pièce filigranée', dragToReposition: 'Faire glisser pour repositionner',
}

const it: TranslationSet = {
  pageTitle: 'Watermark ID — Filigrana privata per documenti', metaDescription: 'Applica una filigrana ai documenti d’identità in modo privato nel browser.', language: 'Lingua', home: 'Home di Watermark ID', imagesStayLocal: 'Le immagini non lasciano mai questo dispositivo', onDeviceOnly: 'Solo sul dispositivo', privateByDesign: 'Privacy fin dalla progettazione', heroLead: 'Condividi il tuo documento.', heroAccent: 'Mantieni il controllo.', heroDescription: 'Ritaglia e applica filigrane ai documenti sensibili senza inviarli altrove. Tutto avviene su questo dispositivo.', addPhotos: 'Aggiungi le foto del documento', addPhotosDescription: 'Scegli un’immagine o selezionane diverse per elaborarle in gruppo.', choosePhoto: 'Scegli foto', takePhoto: 'Scatta foto', fileHint: 'JPEG, PNG o WebP · fino a 40 MB', privacyDetails: 'Dettagli sulla privacy', noUploads: 'Nessun caricamento', worksOffline: 'Funziona offline', noTracking: 'Nessun tracciamento', privateOfflineYours: 'Privato. Offline. Tuo.', imageUnreadableNamed: 'Impossibile leggere {name}.', maxFileSize: 'Ogni immagine deve avere dimensioni massime di 40 MB.', chooseSupported: 'Scegli immagini JPEG, PNG o WebP.', imagesUnreadable: 'Impossibile leggere le immagini selezionate.', skippedOne: '1 file non supportato o troppo grande è stato ignorato.', skippedMany: '{count} file non supportati o troppo grandi sono stati ignorati.', batchAdded: '{count} immagini aggiunte. Le impostazioni correnti si applicano all’intero gruppo.', oneImageUnreadable: 'Impossibile leggere una delle immagini.', presetSavedNotice: 'Preimpostazione predefinita salvata su questo dispositivo.', presetSaveError: 'Il browser non ha potuto salvare la preimpostazione.', presetRestoredNotice: 'Preimpostazione predefinita ripristinata.', enterCompany: 'Inserisci l’azienda destinataria prima di esportare il documento.', savedNotice: 'Salvato sul dispositivo.', batchSavedNotice: '{count} documenti con filigrana salvati in un unico ZIP.', exportError: 'Impossibile esportare le immagini.', sharingUnavailable: 'La condivisione di file non è disponibile. Scarica invece l’immagine.', shareTitle: 'Documento con filigrana', sharedNotice: 'Condiviso in sicurezza dal dispositivo.', shareError: 'Impossibile condividere l’immagine.', documentPreview: 'Anteprima documento', batch: 'Gruppo', batchNavigation: 'Navigazione nel gruppo di immagini', previousImage: 'Immagine precedente', nextImage: 'Immagine successiva', positionOfTotal: '{position} di {total}', adding: 'Aggiunta…', add: 'Aggiungi', removeImage: 'Rimuovi immagine corrente', renderedLocally: 'Anteprima generata localmente', idsPrivateBatch: '{count} documenti · un gruppo privato', idStaysPrivate: 'Il tuo documento resta privato', processedInBrowser: 'Elaborato interamente in questo browser', share: 'Condividi', preparingCount: 'Preparazione di {count}…', preparing: 'Preparazione…', downloadBatch: 'Scarica gruppo ({count})', downloadId: 'Scarica documento con filigrana', dismiss: 'Chiudi messaggio', watermarkSettings: 'Impostazioni filigrana', customize: 'Personalizza', watermark: 'Filigrana', defaultPreset: 'Preimpostazione predefinita', appliedEveryImage: 'Applicata a ogni immagine', restoreDefaultPreset: 'Ripristina la preimpostazione predefinita salvata', restorePreset: 'Ripristina la preimpostazione salvata', saved: 'Salvata', update: 'Aggiorna', saveDefault: 'Salva come predefinita', details: 'Dettagli', targetCompany: 'Azienda destinataria', companyExample: 'es. Banca Northstar', purpose: 'Scopo', defaultPurpose: 'Verifica dell’identità', date: 'Data', includeDate: 'Includi data', pattern: 'Motivo', watermarkPattern: 'Motivo della filigrana', diagonal: 'Diagonale', rows: 'Righe', focus: 'Centrale', opacity: 'Opacità', textSize: 'Dimensione testo', spacing: 'Spaziatura', angle: 'Angolo', color: 'Colore', useColor: 'Usa {color} per la filigrana', chooseCustomColor: 'Scegli un colore personalizzato', customColor: 'Colore personalizzato della filigrana', cardCrop: 'Ritaglio formato carta', useCardCrop: 'Usa ritaglio formato carta', cardProportions: 'Proporzioni ISO/IEC 7810 ID-1 · 85,60 × 53,98 mm', zoom: 'Zoom', resetCrop: 'Reimposta ritaglio', export: 'Esporta', exportFormat: 'Formato di esportazione', quality: 'Qualità', output: 'Risultato', previewCrop: 'Anteprima del documento con filigrana. Trascina per riposizionare il ritaglio.', preview: 'Anteprima del documento con filigrana', dragToReposition: 'Trascina per riposizionare',
}

const es: TranslationSet = {
  pageTitle: 'Watermark ID — Marca de agua privada para documentos', metaDescription: 'Añade una marca de agua a documentos de identidad de forma privada en tu navegador.', language: 'Idioma', home: 'Inicio de Watermark ID', imagesStayLocal: 'Las imágenes nunca salen de este dispositivo', onDeviceOnly: 'Solo en el dispositivo', privateByDesign: 'Privado por diseño', heroLead: 'Comparte tu documento.', heroAccent: 'Mantén el control.', heroDescription: 'Recorta y añade marcas de agua a documentos sensibles sin enviarlos a ninguna parte. Todo ocurre en este dispositivo.', addPhotos: 'Añade fotos de tu documento', addPhotosDescription: 'Elige una imagen o selecciona varias para procesarlas por lotes.', choosePhoto: 'Elegir foto', takePhoto: 'Hacer foto', fileHint: 'JPEG, PNG o WebP · hasta 40 MB', privacyDetails: 'Detalles de privacidad', noUploads: 'Sin subidas', worksOffline: 'Funciona sin conexión', noTracking: 'Sin seguimiento', privateOfflineYours: 'Privado. Sin conexión. Tuyo.', imageUnreadableNamed: 'No se pudo leer {name}.', maxFileSize: 'Cada imagen debe ocupar 40 MB o menos.', chooseSupported: 'Elige imágenes JPEG, PNG o WebP.', imagesUnreadable: 'No se pudieron leer las imágenes seleccionadas.', skippedOne: 'Se omitió 1 archivo no compatible o demasiado grande.', skippedMany: 'Se omitieron {count} archivos no compatibles o demasiado grandes.', batchAdded: 'Se añadieron {count} imágenes. La configuración actual se aplica a todo el lote.', oneImageUnreadable: 'No se pudo leer una de las imágenes.', presetSavedNotice: 'Preajuste predeterminado guardado en este dispositivo.', presetSaveError: 'El navegador no pudo guardar el preajuste.', presetRestoredNotice: 'Preajuste predeterminado restaurado.', enterCompany: 'Introduce la empresa destinataria antes de exportar tu documento.', savedNotice: 'Guardado en tu dispositivo.', batchSavedNotice: 'Se guardaron {count} documentos con marca de agua en un solo ZIP.', exportError: 'No se pudieron exportar las imágenes.', sharingUnavailable: 'Aquí no se pueden compartir archivos. Descarga la imagen en su lugar.', shareTitle: 'Documento con marca de agua', sharedNotice: 'Compartido de forma segura desde tu dispositivo.', shareError: 'No se pudo compartir la imagen.', documentPreview: 'Vista previa del documento', batch: 'Lote', batchNavigation: 'Navegación por el lote de imágenes', previousImage: 'Imagen anterior', nextImage: 'Imagen siguiente', positionOfTotal: '{position} de {total}', adding: 'Añadiendo…', add: 'Añadir', removeImage: 'Eliminar imagen actual', renderedLocally: 'Vista previa generada localmente', idsPrivateBatch: '{count} documentos · un lote privado', idStaysPrivate: 'Tu documento sigue siendo privado', processedInBrowser: 'Procesado íntegramente en este navegador', share: 'Compartir', preparingCount: 'Preparando {count}…', preparing: 'Preparando…', downloadBatch: 'Descargar lote ({count})', downloadId: 'Descargar documento con marca de agua', dismiss: 'Cerrar mensaje', watermarkSettings: 'Ajustes de la marca de agua', customize: 'Personalizar', watermark: 'Marca de agua', defaultPreset: 'Preajuste predeterminado', appliedEveryImage: 'Se aplica a cada imagen', restoreDefaultPreset: 'Restaurar preajuste predeterminado guardado', restorePreset: 'Restaurar preajuste guardado', saved: 'Guardado', update: 'Actualizar', saveDefault: 'Guardar como predeterminado', details: 'Detalles', targetCompany: 'Empresa destinataria', companyExample: 'p. ej., Banco Northstar', purpose: 'Finalidad', defaultPurpose: 'Verificación de identidad', date: 'Fecha', includeDate: 'Incluir fecha', pattern: 'Patrón', watermarkPattern: 'Patrón de la marca de agua', diagonal: 'Diagonal', rows: 'Filas', focus: 'Central', opacity: 'Opacidad', textSize: 'Tamaño del texto', spacing: 'Espaciado', angle: 'Ángulo', color: 'Color', useColor: 'Usar {color} en la marca de agua', chooseCustomColor: 'Elegir un color personalizado', customColor: 'Color personalizado de la marca de agua', cardCrop: 'Recorte de formato tarjeta', useCardCrop: 'Usar recorte de formato tarjeta', cardProportions: 'Proporciones ISO/IEC 7810 ID-1 · 85,60 × 53,98 mm', zoom: 'Zoom', resetCrop: 'Restablecer recorte', export: 'Exportar', exportFormat: 'Formato de exportación', quality: 'Calidad', output: 'Resultado', previewCrop: 'Vista previa del documento con marca de agua. Arrastra para recolocar el recorte.', preview: 'Vista previa del documento con marca de agua', dragToReposition: 'Arrastra para recolocar',
}

const de: TranslationSet = {
  pageTitle: 'Watermark ID — Private Wasserzeichen für Dokumente', metaDescription: 'Versieh Ausweisdokumente privat in deinem Browser mit einem Wasserzeichen.', language: 'Sprache', home: 'Watermark-ID-Startseite', imagesStayLocal: 'Bilder verlassen dieses Gerät nie', onDeviceOnly: 'Nur auf diesem Gerät', privateByDesign: 'Datenschutz von Grund auf', heroLead: 'Teile deinen Ausweis.', heroAccent: 'Behalte die Kontrolle.', heroDescription: 'Schneide vertrauliche Dokumente zu und versieh sie mit Wasserzeichen, ohne sie irgendwohin zu senden. Alles geschieht auf diesem Gerät.', addPhotos: 'Füge deine Ausweisfotos hinzu', addPhotosDescription: 'Wähle ein Bild oder mehrere zur Stapelverarbeitung aus.', choosePhoto: 'Foto auswählen', takePhoto: 'Foto aufnehmen', fileHint: 'JPEG, PNG oder WebP · bis zu 40 MB', privacyDetails: 'Datenschutzhinweise', noUploads: 'Keine Uploads', worksOffline: 'Funktioniert offline', noTracking: 'Kein Tracking', privateOfflineYours: 'Privat. Offline. Deins.', imageUnreadableNamed: '{name} konnte nicht gelesen werden.', maxFileSize: 'Jedes Bild darf höchstens 40 MB groß sein.', chooseSupported: 'Wähle JPEG-, PNG- oder WebP-Bilder aus.', imagesUnreadable: 'Die ausgewählten Bilder konnten nicht gelesen werden.', skippedOne: '1 nicht unterstützte oder zu große Datei wurde übersprungen.', skippedMany: '{count} nicht unterstützte oder zu große Dateien wurden übersprungen.', batchAdded: '{count} Bilder hinzugefügt. Deine aktuellen Einstellungen gelten für den gesamten Stapel.', oneImageUnreadable: 'Eines der Bilder konnte nicht gelesen werden.', presetSavedNotice: 'Standardvoreinstellung auf diesem Gerät gespeichert.', presetSaveError: 'Der Browser konnte die Voreinstellung nicht speichern.', presetRestoredNotice: 'Standardvoreinstellung wiederhergestellt.', enterCompany: 'Gib vor dem Exportieren deines Ausweises das Zielunternehmen ein.', savedNotice: 'Auf deinem Gerät gespeichert.', batchSavedNotice: '{count} Ausweise mit Wasserzeichen in einer ZIP-Datei gespeichert.', exportError: 'Die Bilder konnten nicht exportiert werden.', sharingUnavailable: 'Dateifreigabe ist hier nicht verfügbar. Lade das Bild stattdessen herunter.', shareTitle: 'Ausweis mit Wasserzeichen', sharedNotice: 'Sicher von deinem Gerät geteilt.', shareError: 'Das Bild konnte nicht geteilt werden.', documentPreview: 'Dokumentvorschau', batch: 'Stapel', batchNavigation: 'Navigation im Bilderstapel', previousImage: 'Vorheriges Bild', nextImage: 'Nächstes Bild', positionOfTotal: '{position} von {total}', adding: 'Wird hinzugefügt…', add: 'Hinzufügen', removeImage: 'Aktuelles Bild entfernen', renderedLocally: 'Vorschau lokal erzeugt', idsPrivateBatch: '{count} Ausweise · ein privater Stapel', idStaysPrivate: 'Dein Ausweis bleibt privat', processedInBrowser: 'Vollständig in diesem Browser verarbeitet', share: 'Teilen', preparingCount: '{count} werden vorbereitet…', preparing: 'Wird vorbereitet…', downloadBatch: 'Stapel herunterladen ({count})', downloadId: 'Ausweis mit Wasserzeichen herunterladen', dismiss: 'Meldung schließen', watermarkSettings: 'Wasserzeichen-Einstellungen', customize: 'Anpassen', watermark: 'Wasserzeichen', defaultPreset: 'Standardvoreinstellung', appliedEveryImage: 'Auf jedes Bild angewendet', restoreDefaultPreset: 'Gespeicherte Standardvoreinstellung wiederherstellen', restorePreset: 'Gespeicherte Voreinstellung wiederherstellen', saved: 'Gespeichert', update: 'Aktualisieren', saveDefault: 'Als Standard speichern', details: 'Details', targetCompany: 'Zielunternehmen', companyExample: 'z. B. Northstar Bank', purpose: 'Zweck', defaultPurpose: 'Identitätsprüfung', date: 'Datum', includeDate: 'Datum einfügen', pattern: 'Muster', watermarkPattern: 'Wasserzeichenmuster', diagonal: 'Diagonal', rows: 'Zeilen', focus: 'Zentriert', opacity: 'Deckkraft', textSize: 'Textgröße', spacing: 'Abstand', angle: 'Winkel', color: 'Farbe', useColor: '{color} für das Wasserzeichen verwenden', chooseCustomColor: 'Benutzerdefinierte Farbe auswählen', customColor: 'Benutzerdefinierte Wasserzeichenfarbe', cardCrop: 'Zuschnitt im Kartenformat', useCardCrop: 'Zuschnitt im Kartenformat verwenden', cardProportions: 'ISO/IEC-7810-ID-1-Format · 85,60 × 53,98 mm', zoom: 'Zoom', resetCrop: 'Zuschnitt zurücksetzen', export: 'Export', exportFormat: 'Exportformat', quality: 'Qualität', output: 'Ausgabe', previewCrop: 'Vorschau des Ausweises mit Wasserzeichen. Ziehen, um den Ausschnitt zu verschieben.', preview: 'Vorschau des Ausweises mit Wasserzeichen', dragToReposition: 'Zum Verschieben ziehen',
}

const translations: Record<Locale, TranslationSet> = { en, fr, it, es, de }

export const localeNames: Record<Locale, string> = {
  en: 'English', fr: 'Français', it: 'Italiano', es: 'Español', de: 'Deutsch',
}

export type Translate = (key: TranslationKey, values?: Record<string, string | number>) => string

export function translate(locale: Locale): Translate {
  return (key, values = {}) => Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    translations[locale][key],
  )
}

export function resolveLocale(languages: readonly string[], stored?: string | null): Locale {
  const candidates = stored ? [stored, ...languages] : languages
  for (const candidate of candidates) {
    const locale = candidate.toLowerCase().split('-')[0]
    if (supportedLocales.includes(locale as Locale)) return locale as Locale
  }
  return 'en'
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    // Browser preference detection still works when storage is unavailable.
  }
  return resolveLocale(window.navigator.languages ?? [window.navigator.language], stored)
}

export function defaultPurpose(locale: Locale) {
  return translations[locale].defaultPurpose
}

export function isDefaultPurpose(value: string) {
  return supportedLocales.some((locale) => translations[locale].defaultPurpose === value)
}
