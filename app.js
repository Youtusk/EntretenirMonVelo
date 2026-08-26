/**
 * ENTRETENIRMONVELO.COM - JAVASCRIPT & LOGIQUE INTERACTIVE
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. TYPEWRITER EFFECT
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter-text');
    const words = [
        "graisser une simple chaîne.",
        "changer une chambre à air.",
        "régler un dérailleur en 5 min.",
        "remplacer 2 patins de frein.",
        "dévoiler une roue voilée."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        if (!typewriterElement) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // Pause before typing new word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();


    /* ==========================================================================
       2. GLOW CURSOR FOLLOWER
       ========================================================================== */
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate(${e.clientX - 225}px, ${e.clientY - 225}px)`;
        });
    }


    /* ==========================================================================
       3. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }


    /* ==========================================================================
       4. DYNAMIC COST-SAVING SIMULATOR
       ========================================================================== */
    let currentMultiplier = 1.0;
    const bikeButtons = document.querySelectorAll('.bike-type-btn');
    const sliderCrevaisons = document.getElementById('slider-crevaisons');
    const sliderReglages = document.getElementById('slider-reglages');
    const sliderPieces = document.getElementById('slider-pieces');

    const valCrevaisons = document.getElementById('val-crevaisons');
    const valReglages = document.getElementById('val-reglages');
    const valPieces = document.getElementById('val-pieces');

    const resAtelier = document.getElementById('result-atelier');
    const resDiy = document.getElementById('result-diy');
    const resTemps = document.getElementById('result-temps');
    const resEconomie = document.getElementById('result-economie');

    function calculateSavings() {
        const crevaisons = parseInt(sliderCrevaisons.value, 10);
        const reglages = parseInt(sliderReglages.value, 10);
        const pieces = parseInt(sliderPieces.value, 10);

        // Update labels
        valCrevaisons.textContent = crevaisons;
        valReglages.textContent = reglages;
        valPieces.textContent = pieces;

        // Pricing logic
        const coutAtelier = Math.round(((crevaisons * 30) + (reglages * 38) + (pieces * 55)) * currentMultiplier);
        const coutDiy = Math.round(((crevaisons * 3.5) + (reglages * 0) + (pieces * 11.5)) * (currentMultiplier >= 1.3 ? 1.2 : 1.0));
        const gain = Math.max(0, coutAtelier - coutDiy);

        const totalMinutes = (crevaisons * 8) + (reglages * 6) + (pieces * 14);
        let tempsStr = totalMinutes < 60 ? `~${totalMinutes} min / an` : `~${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 ? (totalMinutes % 60) + 'm' : ''} / an`;

        // Update UI
        if (resAtelier) resAtelier.textContent = coutAtelier;
        if (resDiy) resDiy.textContent = `${coutDiy}€`;
        if (resTemps) resTemps.textContent = totalMinutes > 0 ? tempsStr : '0 min';
        if (resEconomie) resEconomie.textContent = gain;
    }

    bikeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            bikeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMultiplier = parseFloat(btn.dataset.multiplier);
            calculateSavings();
        });
    });

    if (sliderCrevaisons && sliderReglages && sliderPieces) {
        [sliderCrevaisons, sliderReglages, sliderPieces].forEach(slider => {
            slider.addEventListener('input', calculateSavings);
        });
        calculateSavings();
    }


    /* ==========================================================================
       5. 3-CLICK INTERACTIVE DIAGNOSTIC
       ========================================================================== */
    const diagnosticData = {
        crevaison: {
            title: "Pneu dégonflé ou à plat",
            badge: "Panne n°1 (85% des pannes)",
            severity: "Très facile • 8 minutes",
            cause: "Une épine, un bout de verre ou un pincement (sous-gonflage) a percé la chambre à air interne.",
            steps: [
                "Démonte la roue et utilise 2 démonte-pneus en plastique pour sortir un flanc du pneu.",
                "Passe délicatement tes doigts à l'intérieur du pneu pour trouver et retirer l'épine responsable.",
                "Insère une nouvelle chambre à air légèrement pré-gonflée (pour éviter les plis) et regonfle à 3.5 - 4 bars."
            ],
            tools: "2 Démonte-pneus + Pompe + Chambre neuve (3.50€)",
            guideId: "crevaison"
        },
        vitesses: {
            title: "Vitesses qui sautent ou craquent",
            badge: "Réglage 0€",
            severity: "Facile • 5 minutes",
            cause: "Le câble de dérailleur s'est légèrement détendu avec le temps ou la gaine s'est tassée.",
            steps: [
                "Mets ta chaîne sur le plus petit pignon (vitesse la plus dure).",
                "Tourne la molette en plastique située à la sortie de ta manette ou du dérailleur d'un quart de tour dans le sens anti-horaire (pour retendre le câble).",
                "Pédale dans le vide et vérifie la montée fluide vitesse par vitesse sans forcer."
            ],
            tools: "Zéro outil requis (se règle à la main avec la molette de tension)",
            guideId: "derailleur"
        },
        freins: {
            title: "Freinage mou, spongieux ou qui couine",
            badge: "Sécurité prioritaire",
            severity: "Facile • 10 minutes",
            cause: "Garniture de patins ou plaquettes usée, ou câble détendu / surface de jante grasse.",
            steps: [
                "Nettoie la bande de freinage ou le disque avec un chiffon imbibé d'alcool isopropylique (jamais de gras !).",
                "Vérifie la rainure témoin d'usure des patins. Si la gomme est lisse, remplace les patins (desserre la vis Allen de 5mm).",
                "Aligne le patin parfaitement au centre de la jante sans toucher le pneu."
            ],
            tools: "Clé Allen 5mm + Patins neufs (~7€) + Chiffon propre",
            guideId: "freins"
        },
        chaine: {
            title: "Chaîne noire, bruyante ou qui grince",
            badge: "Entretien préventif",
            severity: "Inratable • 6 minutes",
            cause: "Accumulation de poussière abrasive mélangée à de l'ancienne graisse durcie, ou manque d'huile.",
            steps: [
                "Frotte la chaîne avec un chiffon sec ou légèrement imbibé de produit vaisselle/dégraissant.",
                "Applique 1 goutte d'huile pour chaîne vélo sur chaque rouleau (côté intérieur de la chaîne).",
                "Fais tourner le pédalier 10 tours, puis passe un coup de chiffon sec pour retirer le surplus externe."
            ],
            tools: "Huile pour chaîne vélo goutte-à-goutte + Chiffon microfibre",
            guideId: "transmission"
        },
        roue: {
            title: "Roue qui oscille de gauche à droite (voile)",
            badge: "Astuce Mécano",
            severity: "Moyen • 12 minutes",
            cause: "Un ou deux rayons se sont desserrés après un nid-de-poule ou un trottoir.",
            steps: [
                "Fais tourner la roue et repère où la jante s'approche le plus du patin de frein.",
                "Identifie le rayon opposé au point de contact.",
                "Resserre le rayon d'un demi-tour seulement avec une clé à rayons pour ramener la jante au centre."
            ],
            tools: "Clé à rayons universelle (~4€)",
            guideId: "devoilage"
        },
        jeu: {
            title: "Jeu ou claquement dans le guidon / pédalier",
            badge: "Réglage d'alignement",
            severity: "Facile • 4 minutes",
            cause: "Les vis de la potence ou du jeu de direction se sont desserrées avec les vibrations.",
            steps: [
                "Desserre d'abord les 2 vis latérales de la potence du guidon.",
                "Resserre la vis supérieure centrale (vis du capot) modérément pour éliminer le jeu sans bloquer la rotation.",
                "Réaligne le guidon bien droit avec la roue avant et resserre fermement les 2 vis latérales."
            ],
            tools: "Clé Allen de 4mm et 5mm",
            guideId: "checkup"
        }
    };

    const symptomBtns = document.querySelectorAll('.symptom-btn');
    const diagResultContainer = document.getElementById('diagnostic-result');

    function renderDiagnostic(key) {
        const item = diagnosticData[key];
        if (!item || !diagResultContainer) return;

        diagResultContainer.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">${item.badge}</span>
                        <span class="text-xs text-gray-400 font-mono"><i class="fa-solid fa-gauge-high mr-1"></i> ${item.severity}</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white">${item.title}</h3>
                </div>
                <button class="open-guide-modal px-5 py-3 rounded-xl bg-accent text-dark font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-300 transition-all self-start md:self-auto" data-guide-id="${item.guideId}">
                    <span>Voir le tutoriel complet</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span class="text-xs font-mono uppercase text-gray-400 font-bold block mb-2"><i class="fa-solid fa-magnifying-glass text-accent mr-1.5"></i> Cause identifiée</span>
                    <p class="text-xs text-gray-300 leading-relaxed">${item.cause}</p>
                </div>

                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span class="text-xs font-mono uppercase text-gray-400 font-bold block mb-2"><i class="fa-solid fa-screwdriver-wrench text-emerald-400 mr-1.5"></i> Outils requis</span>
                    <p class="text-xs text-emerald-300 font-medium leading-relaxed">${item.tools}</p>
                </div>

                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span class="text-xs font-mono uppercase text-gray-400 font-bold block mb-2"><i class="fa-solid fa-list-check text-teal-400 mr-1.5"></i> Action immédiate</span>
                    <ul class="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                        <li>${item.steps[0]}</li>
                        <li>${item.steps[1]}</li>
                    </ul>
                </div>
            </div>
        `;

        // Rebind guide modal triggers inside injected HTML
        diagResultContainer.querySelectorAll('.open-guide-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                openModalWithGuide(btn.dataset.guideId);
            });
        });
    }

    symptomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            symptomBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDiagnostic(btn.dataset.symptom);
        });
    });

    // Initial render
    renderDiagnostic('crevaison');


    /* ==========================================================================
       6. STEP-BY-STEP MODAL CONTENT & LOGIC
       ========================================================================== */
    const fullGuides = {
        crevaison: {
            title: "Réparer une Crevaison & Remplacer la Chambre",
            time: "8 minutes",
            cost: "3.50€",
            difficulty: "Très Facile",
            tools: ["2 Démonte-pneus en plastique", "Chambre à air aux dimensions de ton pneu", "Pompe avec manomètre"],
            mistake: "Pincer la nouvelle chambre à air entre le pneu et la jante lors du remontage. Gonfle-la toujours légèrement avant de l'insérer.",
            steps: [
                "Mets la chaîne sur le plus petit pignon si c'est la roue arrière, ouvre l'étrier de frein et débloque le serrage rapide pour retirer la roue.",
                "Dégonfle totalement la chambre en appuyant sur la valve. Insère le 1er démonte-pneu sous le bord du pneu, clipse-le sur un rayon, puis fais glisser le 2e démonte-pneu pour libérer un flanc.",
                "Passe délicatement tes doigts à l'intérieur du pneu sur 360° pour repérer l'épine ou le bout de verre coincé (sinon tu re-crèveras au bout de 50 mètres).",
                "Gonfle la nouvelle chambre à l'air libre juste assez pour qu'elle prenne sa forme ronde (1 coup de pompe).",
                "Insère d'abord la valve dans le trou de jante, puis glisse la chambre dans le pneu.",
                "Remets le flanc du pneu dans la jante à la main en finissant par la zone opposée à la valve. Gonfle à la pression indiquée sur le flanc du pneu (ex: 3.5 bars)."
            ]
        },
        transmission: {
            title: "Nettoyage & Lubrification de la Transmission",
            time: "10 minutes",
            cost: "1.00€",
            difficulty: "Inratable",
            tools: ["Chiffon sec ou microfibre", "Brosse à dents usagée", "Lubrifiant chaîne spécifique vélo"],
            mistake: "Vaporiser du WD-40 classique en spray ou mettre trop d'huile (une chaîne dégoulinante attire la poussière et devient noire en 24h).",
            steps: [
                "Enveloppe la chaîne dans un chiffon sec et fais tourner le pédalier en arrière pendant 30 secondes pour retirer la crasse de surface.",
                "Si la chaîne est très encrassée, passe une vieille brosse avec un peu de produit vaisselle, puis rince et essuie immédiatement avec un chiffon sec.",
                "Place le flacon d'huile sur la face interne de la chaîne (celle qui touche les pignons) et dépose une micro-goutte par rouleau en tournant les pédales.",
                "Laisse pénétrer le lubrifiant pendant 5 minutes à l'intérieur des maillons.",
                "Passe un chiffon sec autour de la chaîne pour enlever l'excédent extérieur. L'huile doit être à l'intérieur des rouleaux, pas à l'extérieur !"
            ]
        },
        derailleur: {
            title: "Régler son Dérailleur Arrière en 5 minutes",
            time: "6 minutes",
            cost: "0.00€",
            difficulty: "Moyen",
            tools: ["Aucun outil (ajustement manuel à la molette)"],
            mistake: "Toucher aux vis de butées (H et L) sans raison. Dans 95% des cas, c'est simplement la tension du câble qui doit être ajustée.",
            steps: [
                "Positionne ton vélo de manière à pouvoir faire tourner la roue arrière dans le vide.",
                "Descends sur le plus petit pignon en actionnant la manette de vitesse.",
                "Monte d'une vitesse : si la chaîne hésite à monter ou frotte sur le pignon supérieur, dévisse la molette de tension (sens anti-horaire) d'un demi-tour pour retendre le câble.",
                "Si à l'inverse la chaîne a du mal à redescendre vers les petits pignons, revisse la molette (sens horaire) pour détendre le câble.",
                "Passe toutes les vitesses une à une pour valider que le passage est instantané et silencieux."
            ]
        },
        freins: {
            title: "Changement et Réglage Patins / Plaquettes",
            time: "12 minutes",
            cost: "7.90€",
            difficulty: "Facile",
            tools: ["Clé Allen 4mm ou 5mm", "Patins ou plaquettes neuves", "Chiffon propre + alcool"],
            mistake: "Toucher la surface des plaquettes neuves ou les disques avec des doigts gras.",
            steps: [
                "Desserre la vis de maintien du patin usé avec ta clé Allen et retire l'ancien patin.",
                "Nettoie la piste de freinage de la jante ou le disque avec un chiffon propre.",
                "Positionne le nouveau patin en respectant le sens de rotation indiqué par la flèche.",
                "Règle le patin pour qu'il soit parfaitement centré sur la bande de freinage (il ne doit absolument pas toucher le pneu en caoutchouc).",
                "Serre fermement la vis tout en maintenant le patin bien plaqué contre la jante."
            ]
        },
        devoilage: {
            title: "Dévoiler une Roue avec les Patins de Frein",
            time: "15 minutes",
            cost: "0.00€",
            difficulty: "Moyen",
            tools: ["Clé à rayons universelle"],
            mistake: "Serrer les rayons de 2 tours complets d'un coup. Un dévoilage se fait par micro-quarts de tour !",
            steps: [
                "Place le vélo à l'envers ou sur un support. Fais tourner la roue et utilise les patins de frein comme repère visuel.",
                "Repère l'endroit exact où la jante frotte contre le patin gauche.",
                "Trouve le rayon qui part de ce point vers le côté droit du moyeu.",
                "Resserre ce rayon d'un quart de tour (sens anti-horaire en regardant l'écrou) pour tirer la jante vers la droite.",
                "Vérifie la rotation. Répète par petits quarts de tour jusqu'à ce que la roue tourne parfaitement droit."
            ]
        },
        checkup: {
            title: "Le Checkup Sécurité Express 'ABC Quick' (2 min)",
            time: "2 minutes",
            cost: "0.00€",
            difficulty: "Express",
            tools: ["Tes mains et tes yeux"],
            mistake: "Partir en descente sans avoir testé le mordant des freins après avoir transporté le vélo.",
            steps: [
                "A = AIR : Presse fermement les pneus avec les deux pouces. Ils ne doivent presque pas s'enfoncer.",
                "B = BRAKES (Freins) : Actionne chaque levier. Le frein doit mordre fermement avant que le levier ne touche le guidon.",
                "C = CHAIN (Chaîne) : Vérifie que la chaîne n'est pas rouillée, sèche ou couverte de boue épaisse.",
                "QUICK = Serrages rapides : Vérifie que les leviers de blocage des roues et de la tige de selle sont bien fermés et serrés."
            ]
        }
    };

    const modal = document.getElementById('guide-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');

    function openModalWithGuide(guideKey) {
        const guide = fullGuides[guideKey];
        if (!guide || !modal || !modalContent) return;

        modalContent.innerHTML = `
            <div class="flex items-center gap-3 mb-3">
                <span class="px-2.5 py-1 rounded bg-accent/10 text-accent font-mono text-xs font-bold border border-accent/20">${guide.difficulty}</span>
                <span class="text-xs text-gray-400 font-mono"><i class="fa-regular fa-clock mr-1"></i> ${guide.time}</span>
                <span class="text-xs text-emerald-400 font-mono"><i class="fa-solid fa-coins mr-1"></i> Coût : ${guide.cost}</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-display font-bold text-white mb-6">${guide.title}</h2>

            <!-- Fatal mistake box -->
            <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs mb-6 flex items-start gap-3">
                <i class="fa-solid fa-triangle-exclamation text-base mt-0.5 flex-shrink-0"></i>
                <div><strong class="text-white block font-sans mb-0.5">L'erreur classique à éviter :</strong> ${guide.mistake}</div>
            </div>

            <!-- Tools needed -->
            <div class="mb-6">
                <h4 class="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold mb-2">Matériel nécessaire :</h4>
                <div class="flex flex-wrap gap-2">
                    ${guide.tools.map(t => `<span class="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200"><i class="fa-solid fa-check text-accent mr-1.5"></i>${t}</span>`).join('')}
                </div>
            </div>

            <!-- Steps list -->
            <div>
                <h4 class="text-xs font-mono uppercase tracking-wider text-accent font-bold mb-3">Les étapes pas-à-pas :</h4>
                <div class="space-y-3 mb-6">
                    ${guide.steps.map((step, idx) => `
                        <div class="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                            <div class="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">${idx + 1}</div>
                            <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">${step}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Bottom Close Button -->
            <div class="pt-4 border-t border-white/10 flex justify-end">
                <button type="button" class="close-modal-bottom px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-2">
                    <i class="fa-solid fa-xmark"></i>
                    <span>Fermer le tutoriel</span>
                </button>
            </div>
        `;

        modal.classList.add('active');
        modal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.classList.add('modal-open');

        // Bind bottom close button
        const bottomCloseBtn = modalContent.querySelector('.close-modal-bottom');
        if (bottomCloseBtn) {
            bottomCloseBtn.addEventListener('click', closeModal);
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    // Bind all guide modal triggers
    document.querySelectorAll('.open-guide-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModalWithGuide(btn.dataset.guideId);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            // Close if clicked on the backdrop (outside the inner card)
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Anchor smooth scroll helper
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                closeModal(); // Ensure any open modal is closed and scroll is restored
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });


    /* ==========================================================================
       7. CHECKLIST ROUTINE WITH LOCALSTORAGE
       ========================================================================== */
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const percentText = document.getElementById('checklist-percent');
    const progressBar = document.getElementById('checklist-bar');
    const resetBtn = document.getElementById('reset-checklist');
    const STORAGE_KEY = 'entretenirmonvelo_checklist_state';

    function loadChecklist() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            checkboxes.forEach(cb => {
                const id = cb.dataset.id;
                if (saved[id]) cb.checked = true;
            });
        } catch (e) {
            console.error(e);
        }
        updateProgress();
    }

    function saveChecklist() {
        const state = {};
        checkboxes.forEach(cb => {
            state[cb.dataset.id] = cb.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateProgress();
    }

    function updateProgress() {
        const total = checkboxes.length;
        if (total === 0) return;
        let checkedCount = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) checkedCount++;
        });

        const percent = Math.round((checkedCount / total) * 100);
        if (percentText) percentText.textContent = `${percent}%`;
        if (progressBar) progressBar.style.width = `${percent}%`;
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', saveChecklist);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = false);
            localStorage.removeItem(STORAGE_KEY);
            updateProgress();
        });
    }

    loadChecklist();


    /* ==========================================================================
       8. FAQ ACCORDION
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');
        const icon = header.querySelector('i');

        header.addEventListener('click', () => {
            const isOpen = !body.classList.contains('hidden');
            
            // Close other items
            faqItems.forEach(other => {
                other.querySelector('.faq-body').classList.add('hidden');
                other.querySelector('.faq-header i').style.transform = 'rotate(0deg)';
            });

            if (!isOpen) {
                body.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });


    /* ==========================================================================
       9. CONTACT & GUIDE FORM (AJAX SIMULATION / FEEDBACK)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const feedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();

            if (!name || !email) return;

            // Loading state
            btnText.textContent = "Envoi en cours...";
            btnIcon.className = "fa-solid fa-spinner fa-spin text-xs";
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75');

            setTimeout(() => {
                btnText.textContent = "Message envoyé avec succès !";
                btnIcon.className = "fa-solid fa-check text-xs";
                submitBtn.classList.remove('opacity-75');
                submitBtn.classList.add('bg-emerald-400');

                if (feedback) {
                    feedback.className = "text-center text-xs font-semibold py-2 px-4 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
                    feedback.textContent = `Merci ${name} ! Ta demande a bien été enregistrée.`;
                    feedback.classList.remove('hidden');
                }

                contactForm.reset();

                setTimeout(() => {
                    btnText.textContent = "Envoyer une autre demande";
                    btnIcon.className = "fa-solid fa-paper-plane text-xs";
                    submitBtn.disabled = false;
                }, 4000);
            }, 1000);
        });
    }


    /* ==========================================================================
       10. SOCIAL REVIEWS & STAR RATING LOGIC
       ========================================================================== */
    const starButtons = document.querySelectorAll('.star-btn');
    const ratingLabel = document.getElementById('rating-label');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewFeedback = document.getElementById('review-feedback');
    const REVIEWS_STORAGE_KEY = 'entretenirmonvelo_user_reviews';

    let selectedRating = 5;
    let selectedTag = "🔥 Tuto hyper clair";

    const ratingTexts = {
        1: "1/5 - À améliorer",
        2: "2/5 - Moyen",
        3: "3/5 - Bien",
        4: "4/5 - Très bien !",
        5: "5/5 - Excellent !"
    };

    function updateStars(rating) {
        selectedRating = rating;
        starButtons.forEach((btn, index) => {
            const starIcon = btn.querySelector('i');
            if (index < rating) {
                btn.className = "star-btn text-2xl text-yellow-400 hover:scale-125 transition-transform";
                starIcon.className = "fa-solid fa-star";
            } else {
                btn.className = "star-btn text-2xl text-gray-600 hover:scale-125 transition-transform";
                starIcon.className = "fa-regular fa-star";
            }
        });
        if (ratingLabel) ratingLabel.textContent = ratingTexts[rating] || `${rating}/5`;
    }

    starButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = parseInt(btn.dataset.rating, 10);
            updateStars(rating);
        });
    });

    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tagButtons.forEach(b => {
                b.classList.remove('active');
                b.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                b.style.color = '#cbd5e1';
            });
            btn.classList.add('active');
            btn.style.borderColor = 'var(--accent)';
            btn.style.color = '#ffffff';
            selectedTag = btn.textContent.trim();
        });
    });

    function loadUserReviews() {
        if (!reviewsContainer) return;
        try {
            const userReviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || [];
            userReviews.forEach(rev => {
                renderReviewCard(rev, false);
            });
        } catch (e) {
            console.error(e);
        }
    }

    function renderReviewCard(rev, prepend = true) {
        if (!reviewsContainer) return;
        const initial = (rev.author || "A").charAt(0).toUpperCase();
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < rev.rating) {
                starsHtml += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star text-gray-600"></i>';
            }
        }
        
        const platformText = rev.platform || "via TikTok";
        const card = document.createElement('div');
        card.className = "p-4 rounded-2xl bg-card border border-emerald-400/40 shadow-lg shadow-emerald-500/5 flex items-start gap-3.5";
        card.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-dark font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">${initial}</div>
            <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-white">${rev.author} <span class="text-[10px] text-emerald-400 font-mono ml-1">${platformText}</span></span>
                    <div class="text-yellow-400 text-[11px]">${starsHtml}</div>
                </div>
                <div class="inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono mb-1.5 border border-emerald-500/20">${rev.tag}</div>
                ${rev.comment ? `<p class="text-xs text-gray-300 leading-relaxed">"${rev.comment}"</p>` : ''}
            </div>
        `;

        if (prepend && reviewsContainer.firstChild) {
            reviewsContainer.insertBefore(card, reviewsContainer.firstChild);
        } else {
            reviewsContainer.appendChild(card);
        }
    }

    // Security & Anti-Spam Helpers
    const FORBIDDEN_WORDS = [
        'fdp', 'connard', 'conne', 'salope', 'pute', 'merde', 'encule', 'enculé', 
        'batard', 'bâtard', 'bite', 'chatte', 'nique', 'ntm', 'tg', 'nazi', 
        'hitler', 'suce', 'raciste', 'viol', 'foutre', 'porn', 'sexe', 'arnaque'
    ];

    function sanitizeText(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function containsBadWords(str) {
        if (!str) return false;
        const normalized = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return FORBIDDEN_WORDS.some(word => {
            const regex = new RegExp(`\\b${word}\\b|${word}`, 'i');
            return regex.test(normalized);
        });
    }

    let lastReviewTime = 0;

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawAuthor = document.getElementById('review-author').value.trim();
            const rawComment = document.getElementById('review-comment').value.trim();
            const platformSelect = document.getElementById('review-platform');
            const platform = platformSelect ? platformSelect.value : "via TikTok";

            if (!reviewFeedback) return;

            // Anti-spam cooldown (10s)
            const now = Date.now();
            if (now - lastReviewTime < 10000) {
                reviewFeedback.className = "text-center text-xs font-semibold py-2.5 px-4 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
                reviewFeedback.textContent = "⏳ Merci de patienter quelques secondes avant de reposter un avis.";
                reviewFeedback.classList.remove('hidden');
                return;
            }

            // Pseudo validation
            if (!rawAuthor || rawAuthor.length < 2) {
                reviewFeedback.className = "text-center text-xs font-semibold py-2.5 px-4 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30";
                reviewFeedback.textContent = "⚠️ Merci d'indiquer un prénom ou pseudo valide (minimum 2 caractères).";
                reviewFeedback.classList.remove('hidden');
                return;
            }

            if (rawAuthor.length > 30) {
                reviewFeedback.className = "text-center text-xs font-semibold py-2.5 px-4 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30";
                reviewFeedback.textContent = "⚠️ Ton prénom/pseudo est trop long (max 30 caractères).";
                reviewFeedback.classList.remove('hidden');
                return;
            }

            // Moderation & Profanity Filter
            if (containsBadWords(rawAuthor) || containsBadWords(rawComment)) {
                reviewFeedback.className = "text-center text-xs font-semibold py-2.5 px-4 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30";
                reviewFeedback.textContent = "🚫 Ton message contient des termes inappropriés. Merci de rester respectueux.";
                reviewFeedback.classList.remove('hidden');
                return;
            }

            const cleanAuthor = sanitizeText(rawAuthor);
            const cleanComment = sanitizeText(rawComment);

            const newReview = {
                author: cleanAuthor,
                platform: platform,
                rating: selectedRating,
                tag: selectedTag,
                comment: cleanComment,
                date: new Date().toISOString()
            };

            // Save to localStorage
            try {
                const existing = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || [];
                existing.unshift(newReview);
                localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(existing));
            } catch (err) {
                console.error(err);
            }

            renderReviewCard(newReview, true);
            lastReviewTime = now;

            reviewFeedback.className = "text-center text-xs font-semibold py-2.5 px-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
            reviewFeedback.textContent = "✅ Merci " + cleanAuthor + " ! Ton avis " + platform + " a été validé et publié en direct.";
            reviewFeedback.classList.remove('hidden');

            reviewForm.reset();
            updateStars(5);
        });
    }

    loadUserReviews();

});
