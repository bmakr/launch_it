import {
  ArrowLeft, ArrowRight, Award, ArrowRightSquare, Activity, Anvil,
  BarChart, BrickWall, Bell, Badge,
  CheckCircle, Clock, Check, ChevronDown, ChevronUp,
  Plus, PlusSquare, Home, X, Sun, Moon, User, Play, Info, LogIn, Group, Hand, SquareStack, Gauge, Grip, UserPlus, Users, Send, Newspaper, Eye, Scroll, ImagePlus, ThumbsUp, Star, PlayCircle, Layers, HelpCircle, ArrowRightCircle, GalleryVerticalEnd, ListPlus, UserPlus2, Pipette, Phone, CheckCircle2, Trash2, XCircle, ShieldQuestion, BadgeInfo, LogOut,
  Edit3,
  Save,
  Rocket,
  Hammer,
  Cog,
} from '@tamagui/lucide-icons'
import React from 'react'


export function IconComp(props: any) {
  // icon key value pairs
  const icons: {
    [key: string]: any
  } = {
    about: Info,
    activity: Activity,
    add: Plus,
    add_image: ImagePlus,
    add_user: UserPlus,
    add_users: UserPlus2,
    arrow_left: ArrowLeft,
    arrow_right: ArrowRight,
    arrow_right_square: ArrowRightSquare,
    arrow_right_circle: ArrowRightCircle,
    award: Award,
    anvil: Anvil,
    badge: Badge,
    bar_chart: BarChart,
    score: BarChart,
    bell: Bell,
    brick_wall: BrickWall,
    check: Check,
    check_circle: CheckCircle,  //play
    check_circle_2: CheckCircle2,
    clock: Clock,                //play
    close: X,
    chevron_down: ChevronDown,
    chevron_up: ChevronUp,
    create: PlusSquare,         // home tabs
    delete: Trash2,
    edit: Edit3,
    eye: Eye,
    gallery: GalleryVerticalEnd,
    feed: GalleryVerticalEnd,
    gauge: Gauge,
    home: Home,                 // profile
    info: BadgeInfo,
    layers: Layers,
    list_plus: ListPlus,
    log_in: LogIn,               //profile
    log_out: LogOut,
    moon: Moon,
    novice: Hammer,
    phone: Phone,
    pipe: Pipette,
    play: Play,                 //tabs
    play_circle: PlayCircle,    //play
    plus: Plus,                 //tabs
    profile: User,
    progress: BarChart,
    question_circle: HelpCircle,
    question_shield: ShieldQuestion,
    rocket: Rocket,
    save: Save,
    send: Send,
    settings: Cog,
    star: Star,
    sun: Sun,
    team: Group,
    thumbnails: Grip,
    thumbs_up: ThumbsUp,
    user: User,
    users: Users,
    waitlist: Hand,
    x_circle: XCircle,
  }

  if (!icons[props.name]) {
    return null
  }

  return React.createElement(icons[props.name], props, null)
}
