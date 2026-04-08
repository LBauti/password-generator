        const CHARACTERS = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?~'
        }

        function generatePassword() {
            const length = parseInt(document.getElementById('length-slider').value)
            
            const useUpper = document.getElementById('uppercase').checked
            const useLower = document.getElementById('lowercase').checked
            const useNumbers = document.getElementById('numbers').checked
            const useSymbols = document.getElementById('symbols').checked
            
            let pool = ''
            if (useUpper) pool += CHARACTERS.uppercase
            if (useLower) pool += CHARACTERS.lowercase
            if (useNumbers) pool += CHARACTERS.numbers
            if (useSymbols) pool += CHARACTERS.symbols
            
            if (pool === '') {
                alert("⚠️ Please select at least one character type!")
                return
            }
            
            let password = ''
            const array = new Uint32Array(length)
            
            if (window.crypto && window.crypto.getRandomValues) {
                window.crypto.getRandomValues(array)
                for (let i = 0; i < length; i++) {
                    password += pool[array[i] % pool.length]
                }
            } else {
                for (let i = 0; i < length; i++) {
                    password += pool[Math.floor(Math.random() * pool.length)]
                }
            }
            
            const displayEl = document.getElementById('password-display')
            const emptyEl = document.getElementById('empty-state')
            const hintEl = document.getElementById('password-hint')
            
            displayEl.textContent = password
            emptyEl.classList.add('hidden')
            hintEl.classList.remove('hidden')
            
            displayEl.classList.remove('fade-in')
            void displayEl.offsetWidth // Force reflow
            displayEl.classList.add('fade-in')
            
            updateStrengthIndicator(length, useUpper, useLower, useNumbers, useSymbols)
        }

        function updateStrengthIndicator(length, hasUpper, hasLower, hasNum, hasSym) {
            const indicator = document.getElementById('strength-indicator')
            
            let score = 0
            if (length >= 16) score += 3
            else if (length >= 12) score += 2
            else score += 1
            
            if (hasUpper && hasLower) score += 1
            if (hasNum) score += 1
            if (hasSym) score += 1
            
            if (score >= 5) {
                indicator.textContent = 'VERY STRONG'
                indicator.className = 'px-3 py-1 rounded-3xl bg-emerald-400/10 text-emerald-400 text-[10px] font-mono'
            } else if (score >= 4) {
                indicator.textContent = 'STRONG'
                indicator.className = 'px-3 py-1 rounded-3xl bg-cyan-400/10 text-cyan-400 text-[10px] font-mono'
            } else {
                indicator.textContent = 'GOOD'
                indicator.className = 'px-3 py-1 rounded-3xl bg-amber-400/10 text-amber-400 text-[10px] font-mono'
            }
        }

        async function copyPassword() {
            const displayEl = document.getElementById('password-display')
            const password = displayEl.textContent.trim()
            
            if (!password) return
            
            try {
                await navigator.clipboard.writeText(password)
                
                const btn = document.querySelector('#password-container button')
                const originalHTML = btn.innerHTML
                
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#10b981" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7" />
                    </svg>
                    <span>Copied!</span>
                `
                btn.style.backgroundColor = '#10b981'
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML
                    btn.style.backgroundColor = ''
                }, 2000)
                
                const container = document.getElementById('password-container')
                container.style.transform = 'scale(1.03)'
                setTimeout(() => {
                    container.style.transform = 'scale(1)'
                }, 180)
                
            } catch (err) {
                console.error('Copy failed', err)
                alert('Failed to copy. Please try selecting the text manually.')
            }
        }

        function showModal(title, content) {
            const modal = document.getElementById('modal')
            document.getElementById('modal-title').textContent = title
            document.getElementById('modal-content').innerHTML = `<p class="text-zinc-400 leading-relaxed">${content}</p>`
            modal.classList.remove('hidden')
            modal.classList.add('flex')
        }

        function hideModal() {
            const modal = document.getElementById('modal')
            modal.classList.add('hidden')
            modal.classList.remove('flex')
        }
        
        function initialize() {
            return {
                config(userConfig = {}) {
                    return {
                        content: [],
                        theme: {
                            extend: {
                                colors: {
                                    primary: '#00d4ff'
                                }
                            }
                        },
                        plugins: [],
                        ...userConfig,
                    }
                },
                theme: {
                    extend: {},
                },
            }
        }
        
        window.onload = function () {
            const config = initialize().config()
            document.documentElement.setAttribute('data-tailwind-config', JSON.stringify(config))
            
            const slider = document.getElementById('length-slider')
            const valueDisplay = document.getElementById('length-value')
            
            slider.addEventListener('input', function () {
                valueDisplay.textContent = this.value
            })
            
            document.addEventListener('keydown', function (e) {
                if (e.key.toLowerCase() === 'g' && document.activeElement.tagName === "BODY") {
                    e.preventDefault()
                    generatePassword()
                }
            })
        
        }