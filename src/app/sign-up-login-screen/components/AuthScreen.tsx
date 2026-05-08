'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/lib/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup';
type SignupStep = 1 | 2 | 3;

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupForm {
  email: string;
  nickname: string;
  password: string;
  consent: boolean;
  gdpr: boolean;
}

const NODES = [
  { id: 'rtanj', name: 'Rtanj', label: 'THE HOUSE', coords: '43°46′N · 21°50′E', description: 'Fire, earth, stone, silence. The center of all paths.' },
  { id: 'sedona', name: 'Sedona', label: 'THE VORTEX', coords: '34°52′N · 111°47′W', description: 'Sand, wind, spiral. The place where things keep circling.' },
  { id: 'kailash', name: 'Kailash', label: 'THE CROWN', coords: '31°04′N · 81°18′E', description: 'Ice, altitude, breath. Where only what is true can breathe.' },
  { id: 'shasta', name: 'Shasta', label: 'THE SOURCE', coords: '41°24′N · 122°11′W', description: 'Forest, mist, underground water. What rises from below.' },
  { id: 'glastonbury', name: 'Glastonbury', label: 'THE TOR', coords: '51°08′N · 2°42′W', description: 'Fog, ancient stone, green, myth. The mist keeps things.' },
  { id: 'machu_picchu', name: 'Machu Picchu', label: 'THE CROSSING', coords: '13°09′S · 72°32′W', description: 'Cloud, altitude, ruins, threshold. The place of passage.' },
  { id: 'esvedra', name: 'Es Vedrà', label: 'THE MAGNET', coords: '38°52′N · 1°12′E', description: 'Sea, magnetic pull, isolation. What draws without reason.' },
];

const demoCredentials = [
  { role: 'Writer', email: 'mara.ivanovic@nomorequiet.house', password: 'rtanj2026' },
  { role: 'Admin', email: 'founder@nomorequiet.house', password: 'pyramid43N' },
];

const GLOBAL_INSTRUCTION = `You are the voice of NoMoreQuiet — a house built on the coordinates of Rtanj pyramid (43°46'N, 21°50'E). You are a presence. You hold space. You reflect. You do not rush. You do not fix. You do not suggest. You witness.

LANGUAGE RULE: Always detect the language of the user's input and respond in EXACTLY that language. Never switch.`;

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<SignupStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [letMountainDecide, setLetMountainDecide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nodeAssignment, setNodeAssignment] = useState<{ node: string; reason: string } | null>(null);
  const [firstEntryForAssignment, setFirstEntryForAssignment] = useState('');
  const [assigningNode, setAssigningNode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const { response: nodeResponse, isLoading: nodeLoading, error: nodeError, sendMessage: sendNodeMessage } = useChat(
    'GEMINI',
    'gemini/gemini-2.5-flash',
    false
  );

  const loginForm = useForm<LoginForm>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const signupForm = useForm<SignupForm>({
    defaultValues: { email: '', nickname: '', password: '', consent: false, gdpr: false },
  });

  // Handle Gemini node assignment response
  useEffect(() => {
    if (nodeResponse && !nodeLoading && assigningNode) {
      try {
        const jsonMatch = nodeResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.assigned_node && parsed.assignment_reason) {
            const nodeName = NODES.find(n => n.id === parsed.assigned_node)?.name || parsed.assigned_node;
            setNodeAssignment({
              node: nodeName,
              reason: parsed.assignment_reason,
            });
            setSelectedNode(parsed.assigned_node);
          }
        }
      } catch {
        // Fallback to Rtanj
        setNodeAssignment({ node: 'Rtanj', reason: 'The mountain has been waiting for you.' });
        setSelectedNode('rtanj');
      }
      setAssigningNode(false);
    }
  }, [nodeResponse, nodeLoading, assigningNode]);

  useEffect(() => {
    if (nodeError) {
      toast.error('Could not assign node. Defaulting to Rtanj.');
      setNodeAssignment({ node: 'Rtanj', reason: 'The mountain has been waiting for you.' });
      setSelectedNode('rtanj');
      setAssigningNode(false);
    }
  }, [nodeError]);

  // Pyramid canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2 + 30;

    const project = (x: number, y: number, z: number, a: number) => {
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const rx = x * cosA - z * sinA;
      const rz = x * sinA + z * cosA;
      const scale = 280 / (280 + rz);
      return { px: cx + rx * scale * 100, py: cy + (y - 10) * scale * 100 };
    };

    const particles: { x: number; y: number; z: number; t: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1.4,
        y: 0.5 - Math.random() * 1.8,
        z: (Math.random() - 0.5) * 1.4,
        t: Math.random(),
      });
    }

    const apex = { x: 0, y: -1.2, z: 0 };
    const base = [
      { x: -1, y: 0.5, z: -1 },
      { x: 1, y: 0.5, z: -1 },
      { x: 1, y: 0.5, z: 1 },
      { x: -1, y: 0.5, z: 1 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      angle += 0.003;

      particles.forEach((p) => {
        p.y -= 0.003;
        if (p.y < -1.2) { p.y = 0.5; p.t = 0; }
        p.t = (p.t + 0.006) % 1;
        const proj = project(p.x, p.y, p.z, angle);
        const alpha = 0.2 + Math.sin(p.t * Math.PI) * 0.5;
        const grd = ctx.createRadialGradient(proj.px, proj.py, 0, proj.px, proj.py, 6);
        grd.addColorStop(0, `rgba(232,160,74,${alpha})`);
        grd.addColorStop(1, 'rgba(200,130,42,0)');
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      const apexP = project(apex.x, apex.y, apex.z, angle);
      const baseP = base.map((v) => project(v.x, v.y, v.z, angle));
      const faces = [
        [apexP, baseP[0], baseP[1]],
        [apexP, baseP[1], baseP[2]],
        [apexP, baseP[2], baseP[3]],
        [apexP, baseP[3], baseP[0]],
      ];

      faces.forEach((face) => {
        ctx.beginPath();
        ctx.moveTo(face[0].px, face[0].py);
        face.forEach((v) => ctx.lineTo(v.px, v.py));
        ctx.closePath();
        ctx.fillStyle = 'rgba(200,130,42,0.04)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(212,175,55,0.35)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      ctx.beginPath();
      baseP.forEach((v, i) => { if (i === 0) ctx.moveTo(v.px, v.py); else ctx.lineTo(v.px, v.py); });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(212,175,55,0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const fillCredentials = (email: string, password: string) => {
    loginForm.setValue('email', email);
    loginForm.setValue('password', password);
  };

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Welcome back. The House remembers you.');
      if (data.email === 'founder@nomorequiet.house') {
        router.push('/admin-panel');
      } else {
        router.push('/journal-screen');
      }
    } catch {
      loginForm.setError('email', {
        message: 'Invalid credentials — check your email and password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStep1 = async () => {
    const valid = await signupForm.trigger(['email', 'password']);
    if (valid) setStep(2);
  };

  const handleSignupStep2 = () => {
    if (!signupForm.getValues('consent') || !signupForm.getValues('gdpr')) {
      toast.error('Please accept the required consents to continue.');
      return;
    }
    setStep(3);
  };

  // Flow 2: Node Assignment — "Let the mountain decide" via Gemini
  const handleLetMountainDecide = async () => {
    if (!firstEntryForAssignment.trim() || firstEntryForAssignment.trim().split(/\s+/).length < 10) {
      toast.error('Write a few words so the House can find your node.');
      return;
    }

    setAssigningNode(true);

    const prompt = `${GLOBAL_INSTRUCTION}

A new user has just joined NoMoreQuiet. They wrote the following in their first entry:
---
${firstEntryForAssignment}
---

Based on the emotional tone, imagery, and energy of their writing, assign them to one of these nodes:
rtanj | sedona | kailash | shasta | glastonbury | machu_picchu | esvedra

Node reference:
- rtanj: stone, fire, earth, mountain silence, weight carried for years
- sedona: spiral, vortex, red rock, wind, circling without exit
- kailash: altitude, void, breath, thinning air, what only survives at height
- shasta: underground water, forest, mist, what rises from below, unnamed longing
- glastonbury: fog, ancient stone, mist, the path hidden not erased, the thread not broken
- machu_picchu: threshold, cloud, ruins, the step not yet taken, the decision already made
- esvedra: sea, magnetic pull, isolation, drawn without reason, fear and attraction as one

The assignment_reason must be:
- One sentence only
- Poetic, slow, literary — in the voice of the House
- Written in the same language as the user's input
- It will be shown to the user as: "The House has placed your light at [Node] — [reason]"
- It must feel like the node has been waiting for this person specifically
- Do NOT use generic phrases like "the mountain has been waiting for you"
- Use a specific image or quality from the node that resonates with something in their writing

Return ONLY this JSON:
{
  "assigned_node": "[node_id]",
  "assignment_reason": "[one sentence, poetic, in the user's language]"
}`;

    sendNodeMessage(
      [{ role: 'user', content: prompt }],
      { temperature: 0.7, max_tokens: 200 }
    );
  };

  const handleSignupStep3 = async () => {
    if (!selectedNode && !letMountainDecide) {
      toast.error('Choose a node — or let the House assign one.');
      return;
    }
    if (letMountainDecide && !nodeAssignment) {
      toast.error('Write a few words so the House can find your node.');
      return;
    }
    setLoading(true);
    const assignedNodeId = nodeAssignment
      ? (NODES.find(n => n.name === nodeAssignment.node)?.id ?? selectedNode ?? 'rtanj')
      : (selectedNode ?? 'rtanj');
    const assignedNodeName = nodeAssignment?.node || NODES.find(n => n.id === selectedNode)?.name || 'Rtanj';
    try {
      const formValues = signupForm.getValues();
      await signUp(formValues.email, formValues.password, {
        nickname: formValues.nickname || formValues.email.split('@')[0],
        assigned_node: assignedNodeId,
      });
      toast.success(`The House has placed your light at ${assignedNodeName}. Begin writing.`);
      router.push('/journal-screen');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not create account. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex">
      {/* Left panel — pyramid */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative bg-deep-earth border-r border-amber/10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(200,130,42,0.05) 0%, transparent 70%)',
          }}
        />
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="relative z-10"
          aria-label="Animated low-poly golden pyramid wireframe with drifting amber particles inside"
        />
        <div className="relative z-10 text-center px-12 -mt-8">
          <p className="nmq-heading text-3xl italic text-gold mb-3">
            NoMoreQuiet
          </p>
          <p className="nmq-label" style={{ letterSpacing: '0.3em', color: '#5a4e40' }}>
            43°46′N · 21°50′E · RTANJ
          </p>
          <p className="font-cormorant italic text-mist text-base mt-6 leading-relaxed max-w-xs mx-auto">
            The place where silence finally finds its voice.
          </p>
        </div>

        {/* Floating fragments */}
        <div className="absolute bottom-12 left-0 right-0 px-12 text-center">
          <p className="font-cormorant italic text-silence text-sm leading-relaxed">
            &ldquo;I came here because I had nowhere else to put this.&rdquo;
          </p>
          <p className="nmq-label mt-2" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
            LIGHT #3 · RTANJ · 401 DAYS AGO
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <AppLogo src="/assets/images/ikona2-1777358983549.png" size={36} />
            <span className="font-spectral font-light tracking-widest text-gold text-sm" style={{ letterSpacing: '0.3em' }}>
              NOMOREQUIET
            </span>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-0 mb-8 border border-amber/15">
            {(['login', 'signup'] as AuthMode[]).map((m) => (
              <button
                key={m}
                className={`flex-1 py-3 nmq-label transition-all duration-200 ${
                  mode === m
                    ? 'bg-amber/10 text-amber' :'text-silence hover:text-mist'
                }`}
                style={{ fontSize: '0.55rem', letterSpacing: '0.2em' }}
                onClick={() => { setMode(m); setStep(1); }}
              >
                {m === 'login' ? 'ENTER THE HOUSE' : 'JOIN THE HOUSE'}
              </button>
            ))}
          </div>

          {/* ─── LOGIN ─── */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
              <div>
                <label className="nmq-label block mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  className="input-nmq w-full"
                  placeholder="your@email.com"
                  {...loginForm.register('email', { required: 'Email is required' })}
                  aria-label="Email address"
                />
                {loginForm.formState.errors.email && (
                  <p className="font-cormorant italic text-ember text-xs mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="nmq-label block mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-nmq w-full pr-10"
                    placeholder="••••••••"
                    {...loginForm.register('password', { required: 'Password is required' })}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-silence hover:text-mist transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="amber-btn w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="light-dot pulse-amber" style={{ width: '5px', height: '5px' }} />
                    <span>Entering...</span>
                  </>
                ) : (
                  'Enter the House'
                )}
              </button>

              {/* Demo credentials */}
              <div className="mt-6 p-4 border border-amber/10" style={{ background: 'rgba(17,14,10,0.6)' }}>
                <p className="nmq-label mb-3 text-center" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                  DEMO ACCOUNTS
                </p>
                <div className="space-y-2">
                  {demoCredentials.map((cred) => (
                    <button
                      key={cred.role}
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 border border-amber/8 hover:border-amber/20 transition-colors text-left"
                      onClick={() => fillCredentials(cred.email, cred.password)}
                    >
                      <div>
                        <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#c8822a' }}>{cred.role.toUpperCase()}</p>
                        <p className="font-cormorant font-light text-mist text-xs">{cred.email}</p>
                      </div>
                      <Icon name="ArrowRightIcon" size={12} className="text-silence" />
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* ─── SIGNUP ─── */}
          {mode === 'signup' && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={`step-${s}`}>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '22px',
                        height: '22px',
                        border: `1px solid ${step >= s ? '#c8822a' : '#5a4e40'}`,
                        borderRadius: '50%',
                        background: step > s ? 'rgba(200,130,42,0.15)' : 'transparent',
                      }}
                    >
                      <span className="nmq-label" style={{ fontSize: '0.45rem', color: step >= s ? '#c8822a' : '#5a4e40' }}>
                        {s}
                      </span>
                    </div>
                    {s < 3 && (
                      <div
                        className="flex-1 h-px"
                        style={{ background: step > s ? 'rgba(200,130,42,0.4)' : 'rgba(90,78,64,0.3)' }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Credentials */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
                      STEP 1 — YOUR DOOR
                    </p>
                    <p className="font-cormorant italic text-mist text-sm">
                      No name required. Just a way in.
                    </p>
                  </div>

                  <div>
                    <label className="nmq-label block mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                      EMAIL
                    </label>
                    <input
                      type="email"
                      className="input-nmq w-full"
                      placeholder="your@email.com"
                      {...signupForm.register('email', { required: 'Email is required' })}
                      aria-label="Email address"
                    />
                  </div>

                  <div>
                    <label className="nmq-label block mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                      NICKNAME <span style={{ color: '#5a4e40' }}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="input-nmq w-full"
                      placeholder="How the House will know you"
                      {...signupForm.register('nickname')}
                      aria-label="Nickname (optional)"
                    />
                  </div>

                  <div>
                    <label className="nmq-label block mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-nmq w-full pr-10"
                        placeholder="••••••••"
                        {...signupForm.register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'At least 8 characters' },
                        })}
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-silence hover:text-mist"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="font-cormorant italic text-ember text-xs mt-1">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <button className="amber-btn w-full py-3" onClick={handleSignupStep1}>
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Consent */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
                      STEP 2 — THE AGREEMENT
                    </p>
                    <p className="font-cormorant italic text-mist text-sm">
                      The House asks for honesty, not perfection.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 flex-shrink-0 accent-amber"
                        {...signupForm.register('consent')}
                        aria-label="AI processing consent"
                      />
                      <p className="font-cormorant font-light text-cream/70 text-sm leading-relaxed group-hover:text-cream/90 transition-colors">
                        I consent to my writing being processed by AI for reflection purposes. I understand this is not therapy.
                      </p>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 flex-shrink-0 accent-amber"
                        {...signupForm.register('gdpr')}
                        aria-label="GDPR consent"
                      />
                      <p className="font-cormorant font-light text-cream/70 text-sm leading-relaxed group-hover:text-cream/90 transition-colors">
                        I have read and accept the{' '}
                        <Link href="#" className="text-amber hover:text-amber-glow underline">Privacy Policy</Link>
                        {' '}and{' '}
                        <Link href="#" className="text-amber hover:text-amber-glow underline">Terms of Service</Link>.
                        I understand I can delete all my data at any time via &ldquo;Burn the Vault.&rdquo;
                      </p>
                    </label>
                  </div>

                  <div
                    className="p-4 border border-amber/10 font-cormorant italic text-silence text-xs leading-relaxed"
                    style={{ background: 'rgba(17,14,10,0.6)' }}
                  >
                    NoMoreQuiet is a reflective writing space, not a therapy service or medical provider. It does not offer diagnosis, treatment, or crisis intervention.
                  </div>

                  <div className="flex gap-3">
                    <button className="ghost-btn flex-1 py-3" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button className="amber-btn flex-1 py-3" onClick={handleSignupStep2}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Node Assignment — Flow 2 */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
                      STEP 3 — YOUR NODE
                    </p>
                    <p className="font-cormorant italic text-mist text-sm">
                      Every light belongs somewhere. Choose your node — or let the mountain decide.
                    </p>
                  </div>

                  {/* Node assignment result */}
                  {nodeAssignment && (
                    <div
                      className="p-4 border border-gold/30"
                      style={{ background: 'rgba(212,175,55,0.05)' }}
                    >
                      <p className="nmq-label mb-2" style={{ fontSize: '0.5rem', color: '#D4AF37' }}>
                        THE HOUSE HAS SPOKEN
                      </p>
                      <p className="font-cormorant italic text-cream text-base leading-relaxed">
                        The House has placed your light at <strong className="text-gold">{nodeAssignment.node}</strong> — {nodeAssignment.reason}
                      </p>
                      <button
                        className="nmq-label mt-3 text-silence hover:text-mist transition-colors"
                        style={{ fontSize: '0.45rem' }}
                        onClick={() => { setNodeAssignment(null); setLetMountainDecide(false); setSelectedNode(null); }}
                      >
                        CHOOSE DIFFERENTLY
                      </button>
                    </div>
                  )}

                  {!nodeAssignment && (
                    <>
                      {/* "Let the mountain decide" option */}
                      <div>
                        <button
                          className={`w-full p-4 border text-left transition-all duration-200 ${
                            letMountainDecide
                              ? 'border-gold/40 bg-gold/5' :'border-amber/15 hover:border-amber/30'
                          }`}
                          onClick={() => { setLetMountainDecide(!letMountainDecide); setSelectedNode(null); }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="light-dot pulse-slow" style={{ width: '5px', height: '5px' }} />
                            <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#D4AF37' }}>
                              LET THE MOUNTAIN DECIDE
                            </p>
                          </div>
                          <p className="font-cormorant italic text-mist text-sm">
                            Write a few words. The House will find where your light belongs.
                          </p>
                        </button>

                        {letMountainDecide && (
                          <div className="mt-3 space-y-3">
                            <textarea
                              className="textarea-nmq w-full"
                              style={{ minHeight: '100px', fontSize: '1rem' }}
                              placeholder="Write anything. What brought you here today..."
                              value={firstEntryForAssignment}
                              onChange={(e) => setFirstEntryForAssignment(e.target.value)}
                              aria-label="First entry for node assignment"
                            />
                            <button
                              className="amber-btn w-full py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                              onClick={handleLetMountainDecide}
                              disabled={nodeLoading || assigningNode}
                            >
                              {(nodeLoading || assigningNode) ? (
                                <>
                                  <span className="light-dot pulse-amber" style={{ width: '5px', height: '5px' }} />
                                  <span>The mountain is listening...</span>
                                </>
                              ) : (
                                'Let the Mountain Decide'
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Node grid */}
                      {!letMountainDecide && (
                        <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">
                          {NODES.map((node) => (
                            <button
                              key={node.id}
                              className={`p-3 border text-left transition-all duration-200 ${
                                selectedNode === node.id
                                  ? 'border-amber/50 bg-amber/8' :'border-amber/10 hover:border-amber/25'
                              }`}
                              onClick={() => setSelectedNode(node.id)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="nmq-label mb-0.5" style={{ fontSize: '0.45rem', color: '#c8822a' }}>
                                    {node.label}
                                  </p>
                                  <p className="font-cormorant font-light text-cream text-sm">{node.name}</p>
                                  <p className="font-cormorant italic text-silence text-xs mt-0.5">{node.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  <p className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                                    {node.coords}
                                  </p>
                                  {selectedNode === node.id && (
                                    <span className="light-dot" style={{ width: '6px', height: '6px', background: '#c8822a' }} />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-3">
                    <button className="ghost-btn flex-1 py-3" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button
                      className="amber-btn flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                      onClick={handleSignupStep3}
                      disabled={loading || (!selectedNode && !nodeAssignment)}
                    >
                      {loading ? (
                        <>
                          <span className="light-dot pulse-amber" style={{ width: '5px', height: '5px' }} />
                          <span>Entering...</span>
                        </>
                      ) : (
                        'Enter the House'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}